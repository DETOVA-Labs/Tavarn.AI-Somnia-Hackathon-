export const userAssets = [
  {
    id: 1,
    name: "Cyber Katana X-7",
    type: "Weapon",
    price: "2.5 STT",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=600&fit=crop",
    rarity: "Legendary",
    game: "CyberStrike",
    status: "Listed",
  },
  {
    id: 3,
    name: "Quantum Armor Set",
    type: "Armor",
    price: "3.2 STT",
    image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&h=600&fit=crop",
    rarity: "Legendary",
    game: "QuantumWarriors",
    status: "Owned",
  },
  {
    id: 7,
    name: "Lightning Strike Bow",
    type: "Weapon",
    price: "1.2 STT",
    image: "https://images.unsplash.com/photo-1509396591411-549f5662ff5b?w=800&h=600&fit=crop",
    rarity: "Rare",
    game: "ArcherLegends",
    status: "Owned",
  },
]

export const salesHistory = [
  {
    id: 1,
    asset: "Neon Dragon Skin",
    type: "Sold",
    price: "1.8 STT",
    buyer: "Player_789",
    date: "2 days ago",
    status: "Completed",
  },
  {
    id: 2,
    asset: "Cyber Katana X-7",
    type: "Bought",
    price: "2.2 STT",
    seller: "Player123",
    date: "5 days ago",
    status: "Completed",
  },
  {
    id: 3,
    asset: "Plasma Blaster Pro",
    type: "Sold",
    price: "1.5 STT",
    buyer: "GamerX",
    date: "1 week ago",
    status: "Completed",
  },
  {
    id: 4,
    asset: "Quantum Armor Set",
    type: "Bought",
    price: "3.0 STT",
    seller: "ArmorKing",
    date: "2 weeks ago",
    status: "Completed",
  },
]

export const assetDetails = {
  1: {
    id: 1,
    name: "Cyber Katana X-7",
    type: "Weapon",
    price: "2.5 STT",
    priceUsd: "$4,250",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1200&h=800&fit=crop",
    rarity: "Legendary",
    game: "CyberStrike",
    description: "A legendary cybernetic katana forged in the neon foundries of Neo-Tokyo. This weapon combines ancient samurai craftsmanship with cutting-edge plasma technology.",
    stats: [
      { name: "Damage", value: 95, max: 100 },
      { name: "Speed", value: 88, max: 100 },
      { name: "Range", value: 45, max: 100 },
      { name: "Durability", value: 92, max: 100 },
    ],
    attributes: [
      { trait: "Element", value: "Electric" },
      { trait: "Attack Speed", value: "Fast" },
      { trait: "Special Effect", value: "Lightning Strike" },
      { trait: "Level Requirement", value: "45" },
    ],
    owner: {
      name: "CyberNinja_99",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cyberninja",
      verified: true,
    },
    creator: {
      name: "NeonForge Studios",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=neonforge",
      verified: true,
    },
    history: [
      { event: "Listed", price: "2.5 STT", from: "CyberNinja_99", date: "2 hours ago" },
      { event: "Sale", price: "2.2 STT", from: "Player123", to: "CyberNinja_99", date: "5 days ago" },
      { event: "Minted", price: "1.5 STT", to: "Player123", date: "30 days ago" },
    ],
  },
}

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "Mythic":
      return "bg-gradient-to-r from-purple-500 to-pink-500"
    case "Legendary":
      return "bg-gradient-to-r from-yellow-500 to-orange-500"
    case "Epic":
      return "bg-gradient-to-r from-purple-400 to-blue-500"
    case "Rare":
      return "bg-gradient-to-r from-blue-400 to-cyan-500"
    default:
      return "bg-muted"
  }
}
