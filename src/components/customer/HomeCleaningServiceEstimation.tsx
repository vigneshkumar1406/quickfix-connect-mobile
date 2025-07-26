import EstimationTableView from "./EstimationTableView";
import { useLanguage } from "@/contexts/LanguageContext";

const homeCleaningItems = [
  { id: '1', name: 'Basic House Cleaning', price: 299, selected: false, quantity: 1 },
  { id: '2', name: 'Deep Cleaning', price: 599, selected: false, quantity: 1 },
  { id: '3', name: 'Kitchen Deep Clean', price: 399, selected: false, quantity: 1 },
  { id: '4', name: 'Bathroom Deep Clean', price: 299, selected: false, quantity: 1 },
  { id: '5', name: 'Sofa Cleaning', price: 199, selected: false, quantity: 1 },
  { id: '6', name: 'Carpet Cleaning', price: 249, selected: false, quantity: 1 },
  { id: '7', name: 'Window Cleaning', price: 149, selected: false, quantity: 1 },
  { id: '8', name: 'Balcony Cleaning', price: 99, selected: false, quantity: 1 },
  { id: '9', name: 'Post Construction Cleaning', price: 899, selected: false, quantity: 1 },
  { id: '10', name: 'Office Cleaning', price: 499, selected: false, quantity: 1 }
];

export default function HomeCleaningServiceEstimation() {
  const { t } = useLanguage();
  
  return <EstimationTableView serviceType={t('homeCleaning') || "Home Cleaning"} items={homeCleaningItems} />;
}