
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const assignWorkerSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID format'),
  workerId: z.string().uuid('Invalid worker ID format')
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Validate input
    const body = await req.json()
    const validationResult = assignWorkerSchema.safeParse(body)
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.issues }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    const { bookingId, workerId } = validationResult.data

    // Verify user has permission (must be admin or the booking's customer)
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    // Update booking with assigned worker
    const { data: booking, error: updateError } = await supabaseClient
      .from('service_bookings')
      .update({
        worker_id: workerId,
        status: 'assigned'
      })
      .eq('id', bookingId)
      .select('*, workers(*), profiles!service_bookings_customer_id_fkey(*)')
      .single()

    if (updateError) throw updateError

    // Send notification to customer
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: booking.customer_id,
        title: 'Worker Assigned',
        message: `A worker has been assigned to your ${booking.service_type} service.`,
        type: 'booking_accepted',
        data: { booking_id: bookingId, worker_id: workerId }
      })

    // Send notification to worker
    if (booking.workers) {
      await supabaseClient
        .from('notifications')
        .insert({
          user_id: booking.workers.user_id,
          title: 'New Job Assignment',
          message: `You have been assigned a new ${booking.service_type} job.`,
          type: 'booking_request',
          data: { booking_id: bookingId }
        })
    }

    return new Response(
      JSON.stringify({ success: true, booking }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
