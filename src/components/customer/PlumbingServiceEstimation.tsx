
import EstimationTableView from "./EstimationTableView";

const plumbingItems = [
  { id: '1', name: 'Tap Installation', price: 149, selected: false, quantity: 1 },
  { id: '2', name: 'Pipe Repair', price: 199, selected: false, quantity: 1 },
  { id: '3', name: 'Toilet Installation', price: 399, selected: false, quantity: 1 },
  { id: '4', name: 'Basin Installation', price: 249, selected: false, quantity: 1 },
  { id: '5', name: 'Shower Installation', price: 299, selected: false, quantity: 1 },
  { id: '6', name: 'Water Tank Cleaning', price: 499, selected: false, quantity: 1 },
  { id: '7', name: 'Drainage Cleaning', price: 349, selected: false, quantity: 1 },
  { id: '8', name: 'Water Heater Service', price: 449, selected: false, quantity: 1 },
  { id: '9', name: 'Pipe Installation', price: 199, selected: false, quantity: 1 },
  { id: '10', name: 'Emergency Repair', price: 299, selected: false, quantity: 1 }
];

export default function PlumbingServiceEstimation() {
  return <EstimationTableView serviceType="Plumbing" items={plumbingItems} />;
}
