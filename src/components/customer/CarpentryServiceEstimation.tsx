
import EstimationTableView from "./EstimationTableView";

const carpentryItems = [
  { id: '1', name: 'Door Fitting', price: 299, selected: false, quantity: 1 },
  { id: '2', name: 'Window Installation', price: 399, selected: false, quantity: 1 },
  { id: '3', name: 'Furniture Repair', price: 199, selected: false, quantity: 1 },
  { id: '4', name: 'Cabinet Installation', price: 499, selected: false, quantity: 1 },
  { id: '5', name: 'Shelving Work', price: 149, selected: false, quantity: 1 },
  { id: '6', name: 'Wooden Flooring', price: 899, selected: false, quantity: 1 },
  { id: '7', name: 'Wardrobe Installation', price: 799, selected: false, quantity: 1 },
  { id: '8', name: 'Custom Furniture', price: 1299, selected: false, quantity: 1 },
  { id: '9', name: 'Wood Polishing', price: 249, selected: false, quantity: 1 },
  { id: '10', name: 'Carpenter Repair', price: 299, selected: false, quantity: 1 }
];

export default function CarpentryServiceEstimation() {
  return <EstimationTableView serviceType="Carpentry" items={carpentryItems} />;
}
