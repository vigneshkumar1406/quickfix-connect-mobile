import EstimationTableView from "./EstimationTableView";
import { useLanguage } from "@/contexts/LanguageContext";

const paintingItems = [
  { id: '1', name: 'Wall Painting (per room)', price: 399, selected: false, quantity: 1 },
  { id: '2', name: 'Ceiling Painting', price: 299, selected: false, quantity: 1 },
  { id: '3', name: 'Door/Window Painting', price: 199, selected: false, quantity: 1 },
  { id: '4', name: 'Exterior Wall Painting', price: 699, selected: false, quantity: 1 },
  { id: '5', name: 'Texture Painting', price: 599, selected: false, quantity: 1 },
  { id: '6', name: 'Wood Polishing', price: 349, selected: false, quantity: 1 },
  { id: '7', name: 'Metal Painting', price: 249, selected: false, quantity: 1 },
  { id: '8', name: 'Wall Primer', price: 149, selected: false, quantity: 1 },
  { id: '9', name: 'Waterproofing', price: 499, selected: false, quantity: 1 },
  { id: '10', name: 'Asian Paints Service', price: 799, selected: false, quantity: 1 }
];

export default function PaintingServiceEstimation() {
  const { t } = useLanguage();
  
  return <EstimationTableView serviceType={t('painting') || "Painting"} items={paintingItems} />;
}