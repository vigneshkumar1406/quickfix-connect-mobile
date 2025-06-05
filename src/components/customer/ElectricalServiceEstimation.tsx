
import EstimationTableView from "./EstimationTableView";

const electricalItems = [
  { id: '1', name: 'Light Fitting', price: 99, selected: false, quantity: 1 },
  { id: '2', name: 'Fan Installation', price: 149, selected: false, quantity: 1 },
  { id: '3', name: 'Switch Board Installation', price: 199, selected: false, quantity: 1 },
  { id: '4', name: 'Socket Installation', price: 89, selected: false, quantity: 1 },
  { id: '5', name: 'Wiring (per room)', price: 299, selected: false, quantity: 1 },
  { id: '6', name: 'Inverter Installation', price: 499, selected: false, quantity: 1 },
  { id: '7', name: 'MCB/Fuse Box', price: 249, selected: false, quantity: 1 },
  { id: '8', name: 'Emergency Light Setup', price: 179, selected: false, quantity: 1 },
  { id: '9', name: 'Geyser Installation', price: 399, selected: false, quantity: 1 },
  { id: '10', name: 'Electrical Repair', price: 199, selected: false, quantity: 1 }
];

export default function ElectricalServiceEstimation() {
  return <EstimationTableView serviceType="Electrical" items={electricalItems} />;
}
