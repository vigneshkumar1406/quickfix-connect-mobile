import EstimationTableView from "./EstimationTableView";
import { useLanguage } from "@/contexts/LanguageContext";

const applianceRepairItems = [
  { id: '1', name: 'AC Service & Repair', price: 399, selected: false, quantity: 1 },
  { id: '2', name: 'Refrigerator Repair', price: 299, selected: false, quantity: 1 },
  { id: '3', name: 'Washing Machine Repair', price: 249, selected: false, quantity: 1 },
  { id: '4', name: 'Microwave Repair', price: 199, selected: false, quantity: 1 },
  { id: '5', name: 'TV Repair', price: 349, selected: false, quantity: 1 },
  { id: '6', name: 'Geyser Repair', price: 299, selected: false, quantity: 1 },
  { id: '7', name: 'Mixer Grinder Repair', price: 149, selected: false, quantity: 1 },
  { id: '8', name: 'Induction Cooktop Repair', price: 199, selected: false, quantity: 1 },
  { id: '9', name: 'Chimney Service', price: 249, selected: false, quantity: 1 },
  { id: '10', name: 'Water Purifier Service', price: 199, selected: false, quantity: 1 }
];

export default function ApplianceRepairServiceEstimation() {
  const { t } = useLanguage();
  
  return <EstimationTableView serviceType={t('applianceRepair') || "Appliance Repair"} items={applianceRepairItems} />;
}