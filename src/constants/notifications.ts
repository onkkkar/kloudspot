export interface Notification {
  id: string;
  date: string;
  personName: string;
  zone: string;
  priority: "high" | "medium" | "low";
}

export const notifications: Notification[] = [
  {
    id: "1",
    date: "March 03 2025 10:12",
    personName: "Ahmad",
    zone: "Zone B",
    priority: "high",
  },
  {
    id: "2",
    date: "March 03 2025 09:45",
    personName: "Sarah",
    zone: "Zone A",
    priority: "medium",
  },
  {
    id: "3",
    date: "March 03 2025 09:30",
    personName: "John",
    zone: "Zone C",
    priority: "low",
  },
  {
    id: "4",
    date: "March 03 2025 08:15",
    personName: "Maria",
    zone: "Zone D",
    priority: "high",
  },
  {
    id: "5",
    date: "March 03 2025 07:50",
    personName: "David",
    zone: "Zone E",
    priority: "medium",
  },
  {
    id: "6",
    date: "March 03 2025 07:20",
    personName: "Emma",
    zone: "Zone F",
    priority: "low",
  },
  {
    id: "7",
    date: "March 03 2025 06:45",
    personName: "Michael",
    zone: "Zone G",
    priority: "high",
  },
];
