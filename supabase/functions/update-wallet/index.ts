import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const walletUpdateSchema = z.object({
  amount: z.number().positive('Amount must be positive').max(1000000, 'Amount too large'),
  type: z.enum(['credit', 'debit'], { errorMap: () => ({ message: 'Type must be credit or debit' }) }),
  description: z.string().min(1, 'Description is required').max(500),
  bookingId: z.string().uuid('Invalid booking ID').optional()
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Use service role for secure wallet operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    // Validate input
    const body = await req.json()
    const validationResult = walletUpdateSchema.safeParse(body)
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.issues }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    const { amount, type, description, bookingId } = validationResult.data

    // If bookingId is provided, verify it belongs to the user
    if (bookingId) {
      const { data: booking } = await supabaseClient
        .from('service_bookings')
        .select('customer_id, worker_id')
        .eq('id', bookingId)
        .single()
      
      if (!booking || (booking.customer_id !== user.id && booking.worker_id !== user.id)) {
        return new Response(
          JSON.stringify({ error: 'Booking not found or unauthorized' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 403,
          },
        )
      }
    }

    // Get or create wallet
    let { data: wallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (walletError && walletError.code === 'PGRST116') {
      // Wallet doesn't exist, create it
      const { data: newWallet, error: createError } = await supabaseClient
        .from('wallets')
        .insert({ user_id: user.id, balance: 0, total_earned: 0 })
        .select()
        .single()
      
      if (createError) throw createError
      wallet = newWallet
    } else if (walletError) {
      throw walletError
    }

    const currentBalance = wallet.balance || 0
    const currentEarned = wallet.total_earned || 0
    
    // Calculate new balance
    const newBalance = type === 'credit' ? currentBalance + amount : currentBalance - amount
    
    // Prevent negative balance for debit operations
    if (newBalance < 0) {
      return new Response(
        JSON.stringify({ error: 'Insufficient balance' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }
    
    // Update wallet atomically
    const { error: updateError } = await supabaseClient
      .from('wallets')
      .update({ 
        balance: newBalance,
        total_earned: type === 'credit' ? currentEarned + amount : currentEarned
      })
      .eq('user_id', user.id)
    
    if (updateError) throw updateError
    
    // Create transaction record
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('wallet_transactions')
      .insert({
        user_id: user.id,
        amount,
        type,
        description,
        booking_id: bookingId,
        balance_after: newBalance
      })
      .select()
      .single()
    
    if (transactionError) throw transactionError

    return new Response(
      JSON.stringify({ 
        success: true, 
        balance: newBalance,
        transaction 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Wallet update error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
