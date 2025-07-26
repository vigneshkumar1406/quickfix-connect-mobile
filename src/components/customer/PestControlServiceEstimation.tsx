import EstimationTableView from "./EstimationTableView";
import { useLanguage } from "@/contexts/LanguageContext";

const pestControlItems = [
  { id: '1', name: 'General Pest Control', price: 499, selected: false, quantity: 1 },
  { id: '2', name: 'Cockroach Control', price: 299, selected: false, quantity: 1 },
  { id: '3', name: 'Ant Control', price: 199, selected: false, quantity: 1 },
  { id: '4', name: 'Termite Control', price: 899, selected: false, quantity: 1 },
  { id: '5', name: 'Mosquito Control', price: 399, selected: false, quantity: 1 },
  { id: '6', name: 'Rodent Control', price: 599, selected: false, quantity: 1 },
  { id: '7', name: 'Bed Bug Treatment', price: 699, selected: false, quantity: 1 },
  { id: '8', name: 'Pre-Construction Treatment', price: 1299, selected: false, quantity: 1 },
  { id: '9', name: 'Post-Construction Treatment', price: 999, selected: false, quantity: 1 },
  { id: '10', name: 'Wood Borer Treatment', price: 549, selected: false, quantity: 1 }
];

export default function PestControlServiceEstimation() {
  const { t } = useLanguage();
  
  return <EstimationTableView serviceType={t('pestControl') || "Pest Control"} items={pestControlItems} />;
}