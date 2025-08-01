"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Leaf, Droplets, Search, Filter } from "lucide-react"

interface Plant {
  id: number
  name: string
  image: string
  carbonSequestration: number
  waterNeeds: "low" | "medium" | "high"
  plantType: "tree" | "shrub" | "grass" | "flower" | "herb" | "vine"
  description: string
}

const plants: Plant[] = [
  // Trees
  {
    id: 1,
    name: "Oak Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 48,
    waterNeeds: "low",
    plantType: "tree",
    description: "Native hardwood excellent for large spaces",
  },
  {
    id: 2,
    name: "Pine Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 50,
    waterNeeds: "low",
    plantType: "tree",
    description: "Evergreen conifer perfect for year-round coverage",
  },
  {
    id: 3,
    name: "Maple Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 42,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Beautiful deciduous tree with stunning fall colors",
  },
  {
    id: 4,
    name: "Willow Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 45,
    waterNeeds: "high",
    plantType: "tree",
    description: "Graceful tree that thrives in wet conditions",
  },
  {
    id: 5,
    name: "Cedar Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 40,
    waterNeeds: "low",
    plantType: "tree",
    description: "Aromatic evergreen with natural pest resistance",
  },
  {
    id: 6,
    name: "Birch Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 38,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Distinctive white bark adds visual interest",
  },
  {
    id: 7,
    name: "Eucalyptus",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 55,
    waterNeeds: "low",
    plantType: "tree",
    description: "Fast-growing with aromatic leaves",
  },
  {
    id: 8,
    name: "Redwood",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 85,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Massive carbon sequestration champion",
  },
  {
    id: 9,
    name: "Douglas Fir",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 52,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Popular Christmas tree with excellent growth",
  },
  {
    id: 10,
    name: "Spruce Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 46,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Hardy evergreen for cold climates",
  },
  {
    id: 11,
    name: "Ash Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 44,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Strong hardwood with compound leaves",
  },
  {
    id: 12,
    name: "Elm Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 41,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Classic shade tree with vase-like shape",
  },
  {
    id: 13,
    name: "Poplar Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 39,
    waterNeeds: "high",
    plantType: "tree",
    description: "Fast-growing tree for wet areas",
  },
  {
    id: 14,
    name: "Sycamore Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 43,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Large shade tree with distinctive bark",
  },
  {
    id: 15,
    name: "Hickory Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 47,
    waterNeeds: "low",
    plantType: "tree",
    description: "Nut-producing hardwood tree",
  },
  {
    id: 16,
    name: "Chestnut Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 49,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Historic nut tree making a comeback",
  },
  {
    id: 17,
    name: "Walnut Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 51,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Valuable hardwood and nut producer",
  },
  {
    id: 18,
    name: "Cherry Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 35,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Beautiful spring blooms and fruit",
  },
  {
    id: 19,
    name: "Apple Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 33,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Fruit-bearing tree for orchards",
  },
  {
    id: 20,
    name: "Magnolia Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 37,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Stunning large fragrant flowers",
  },

  // Shrubs
  {
    id: 21,
    name: "Rhododendron",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 15,
    waterNeeds: "medium",
    plantType: "shrub",
    description: "Colorful flowering evergreen shrub",
  },
  {
    id: 22,
    name: "Azalea",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 12,
    waterNeeds: "medium",
    plantType: "shrub",
    description: "Vibrant spring-blooming shrub",
  },
  {
    id: 23,
    name: "Boxwood",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 10,
    waterNeeds: "low",
    plantType: "shrub",
    description: "Classic hedge and topiary plant",
  },
  {
    id: 24,
    name: "Holly",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 18,
    waterNeeds: "low",
    plantType: "shrub",
    description: "Evergreen with bright red berries",
  },
  {
    id: 25,
    name: "Juniper",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 16,
    waterNeeds: "low",
    plantType: "shrub",
    description: "Hardy evergreen for dry conditions",
  },
  {
    id: 26,
    name: "Forsythia",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 14,
    waterNeeds: "medium",
    plantType: "shrub",
    description: "Early spring yellow flowers",
  },
  {
    id: 27,
    name: "Lilac",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 17,
    waterNeeds: "medium",
    plantType: "shrub",
    description: "Fragrant purple spring blooms",
  },
  {
    id: 28,
    name: "Rose Bush",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 8,
    waterNeeds: "medium",
    plantType: "shrub",
    description: "Classic flowering shrub",
  },
  {
    id: 29,
    name: "Hydrangea",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 13,
    waterNeeds: "high",
    plantType: "shrub",
    description: "Large colorful flower clusters",
  },
  {
    id: 30,
    name: "Viburnum",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 19,
    waterNeeds: "medium",
    plantType: "shrub",
    description: "Versatile shrub with berries",
  },

  // Grasses
  {
    id: 31,
    name: "Bamboo",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 35,
    waterNeeds: "medium",
    plantType: "grass",
    description: "Fast-growing sustainable grass",
  },
  {
    id: 32,
    name: "Fountain Grass",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 5,
    waterNeeds: "low",
    plantType: "grass",
    description: "Ornamental grass with feathery plumes",
  },
  {
    id: 33,
    name: "Pampas Grass",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 8,
    waterNeeds: "low",
    plantType: "grass",
    description: "Large ornamental grass with plumes",
  },
  {
    id: 34,
    name: "Blue Fescue",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 3,
    waterNeeds: "low",
    plantType: "grass",
    description: "Compact blue-gray ornamental grass",
  },
  {
    id: 35,
    name: "Switchgrass",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 12,
    waterNeeds: "low",
    plantType: "grass",
    description: "Native prairie grass for biofuel",
  },
  {
    id: 36,
    name: "Miscanthus",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 15,
    waterNeeds: "medium",
    plantType: "grass",
    description: "Tall ornamental grass for screens",
  },
  {
    id: 37,
    name: "Buffalo Grass",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 4,
    waterNeeds: "low",
    plantType: "grass",
    description: "Drought-tolerant lawn grass",
  },
  {
    id: 38,
    name: "Sedge",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 6,
    waterNeeds: "high",
    plantType: "grass",
    description: "Wetland grass for rain gardens",
  },
  {
    id: 39,
    name: "Reed Grass",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 10,
    waterNeeds: "high",
    plantType: "grass",
    description: "Tall grass for water features",
  },
  {
    id: 40,
    name: "Feather Grass",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 7,
    waterNeeds: "low",
    plantType: "grass",
    description: "Delicate ornamental grass",
  },

  // Flowers
  {
    id: 41,
    name: "Sunflower",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 2,
    waterNeeds: "medium",
    plantType: "flower",
    description: "Tall annual with large yellow blooms",
  },
  {
    id: 42,
    name: "Marigold",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 1,
    waterNeeds: "low",
    plantType: "flower",
    description: "Bright orange pest-deterrent annual",
  },
  {
    id: 43,
    name: "Petunia",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 1,
    waterNeeds: "medium",
    plantType: "flower",
    description: "Colorful cascading annual flower",
  },
  {
    id: 44,
    name: "Zinnia",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 1,
    waterNeeds: "low",
    plantType: "flower",
    description: "Easy-care annual in many colors",
  },
  {
    id: 45,
    name: "Cosmos",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 2,
    waterNeeds: "low",
    plantType: "flower",
    description: "Delicate annual with feathery foliage",
  },
  {
    id: 46,
    name: "Black-eyed Susan",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 3,
    waterNeeds: "low",
    plantType: "flower",
    description: "Native perennial wildflower",
  },
  {
    id: 47,
    name: "Coneflower",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 3,
    waterNeeds: "low",
    plantType: "flower",
    description: "Purple perennial attracts butterflies",
  },
  {
    id: 48,
    name: "Daylily",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 4,
    waterNeeds: "medium",
    plantType: "flower",
    description: "Hardy perennial with trumpet blooms",
  },
  {
    id: 49,
    name: "Iris",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 3,
    waterNeeds: "medium",
    plantType: "flower",
    description: "Elegant perennial with sword-like leaves",
  },
  {
    id: 50,
    name: "Peony",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 5,
    waterNeeds: "medium",
    plantType: "flower",
    description: "Fragrant perennial with large blooms",
  },

  // Herbs
  {
    id: 51,
    name: "Lavender",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 6,
    waterNeeds: "low",
    plantType: "herb",
    description: "Fragrant herb with purple spikes",
  },
  {
    id: 52,
    name: "Rosemary",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 8,
    waterNeeds: "low",
    plantType: "herb",
    description: "Evergreen culinary herb",
  },
  {
    id: 53,
    name: "Thyme",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 2,
    waterNeeds: "low",
    plantType: "herb",
    description: "Low-growing aromatic herb",
  },
  {
    id: 54,
    name: "Sage",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 4,
    waterNeeds: "low",
    plantType: "herb",
    description: "Silver-leaved culinary herb",
  },
  {
    id: 55,
    name: "Oregano",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 3,
    waterNeeds: "medium",
    plantType: "herb",
    description: "Spreading culinary herb",
  },
  {
    id: 56,
    name: "Basil",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 2,
    waterNeeds: "medium",
    plantType: "herb",
    description: "Annual culinary herb",
  },
  {
    id: 57,
    name: "Mint",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 3,
    waterNeeds: "high",
    plantType: "herb",
    description: "Spreading aromatic herb",
  },
  {
    id: 58,
    name: "Chives",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 1,
    waterNeeds: "medium",
    plantType: "herb",
    description: "Onion-flavored herb with purple flowers",
  },
  {
    id: 59,
    name: "Parsley",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 2,
    waterNeeds: "medium",
    plantType: "herb",
    description: "Biennial culinary herb",
  },
  {
    id: 60,
    name: "Cilantro",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 1,
    waterNeeds: "medium",
    plantType: "herb",
    description: "Annual herb with distinctive flavor",
  },

  // Vines
  {
    id: 61,
    name: "Grape Vine",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 25,
    waterNeeds: "medium",
    plantType: "vine",
    description: "Fruit-producing climbing vine",
  },
  {
    id: 62,
    name: "Ivy",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 12,
    waterNeeds: "low",
    plantType: "vine",
    description: "Evergreen climbing vine",
  },
  {
    id: 63,
    name: "Clematis",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 8,
    waterNeeds: "medium",
    plantType: "vine",
    description: "Flowering climbing vine",
  },
  {
    id: 64,
    name: "Honeysuckle",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 10,
    waterNeeds: "medium",
    plantType: "vine",
    description: "Fragrant flowering vine",
  },
  {
    id: 65,
    name: "Morning Glory",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 5,
    waterNeeds: "medium",
    plantType: "vine",
    description: "Annual vine with trumpet flowers",
  },
  {
    id: 66,
    name: "Wisteria",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 15,
    waterNeeds: "medium",
    plantType: "vine",
    description: "Dramatic flowering vine",
  },
  {
    id: 67,
    name: "Virginia Creeper",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 18,
    waterNeeds: "low",
    plantType: "vine",
    description: "Native climbing vine with fall color",
  },
  {
    id: 68,
    name: "Trumpet Vine",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 14,
    waterNeeds: "low",
    plantType: "vine",
    description: "Orange flowering vine attracts hummingbirds",
  },
  {
    id: 69,
    name: "Jasmine",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 9,
    waterNeeds: "medium",
    plantType: "vine",
    description: "Fragrant white flowering vine",
  },
  {
    id: 70,
    name: "Passion Vine",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 11,
    waterNeeds: "medium",
    plantType: "vine",
    description: "Exotic flowering vine with fruit",
  },

  // Additional Trees
  {
    id: 71,
    name: "Linden Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 46,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Fragrant flowering shade tree",
  },
  {
    id: 72,
    name: "Tulip Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 54,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Fast-growing with tulip-shaped flowers",
  },
  {
    id: 73,
    name: "Sweet Gum",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 41,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Star-shaped leaves with fall color",
  },
  {
    id: 74,
    name: "Catalpa Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 38,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Large heart-shaped leaves",
  },
  {
    id: 75,
    name: "Redbud Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 28,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Pink spring flowers before leaves",
  },

  // Additional Shrubs
  {
    id: 76,
    name: "Spirea",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 11,
    waterNeeds: "medium",
    plantType: "shrub",
    description: "Cascading white or pink flowers",
  },
  {
    id: 77,
    name: "Weigela",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 13,
    waterNeeds: "medium",
    plantType: "shrub",
    description: "Tubular flowers in spring",
  },
  {
    id: 78,
    name: "Barberry",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 9,
    waterNeeds: "low",
    plantType: "shrub",
    description: "Thorny shrub with colorful foliage",
  },
  {
    id: 79,
    name: "Privet",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 12,
    waterNeeds: "low",
    plantType: "shrub",
    description: "Dense hedge shrub",
  },
  {
    id: 80,
    name: "Yew",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 16,
    waterNeeds: "low",
    plantType: "shrub",
    description: "Evergreen shrub for topiary",
  },

  // Additional Flowers
  {
    id: 81,
    name: "Salvia",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 2,
    waterNeeds: "low",
    plantType: "flower",
    description: "Spiky flowers attract hummingbirds",
  },
  {
    id: 82,
    name: "Verbena",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 2,
    waterNeeds: "low",
    plantType: "flower",
    description: "Clusters of small colorful flowers",
  },
  {
    id: 83,
    name: "Impatiens",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 1,
    waterNeeds: "high",
    plantType: "flower",
    description: "Shade-loving annual flower",
  },
  {
    id: 84,
    name: "Begonia",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 2,
    waterNeeds: "medium",
    plantType: "flower",
    description: "Waxy flowers for shade",
  },
  {
    id: 85,
    name: "Coleus",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 2,
    waterNeeds: "medium",
    plantType: "flower",
    description: "Colorful foliage plant",
  },

  // Additional Herbs
  {
    id: 86,
    name: "Dill",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 1,
    waterNeeds: "medium",
    plantType: "herb",
    description: "Feathery annual herb",
  },
  {
    id: 87,
    name: "Fennel",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 3,
    waterNeeds: "medium",
    plantType: "herb",
    description: "Tall herb with feathery foliage",
  },
  {
    id: 88,
    name: "Tarragon",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 2,
    waterNeeds: "low",
    plantType: "herb",
    description: "Perennial culinary herb",
  },
  {
    id: 89,
    name: "Marjoram",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 2,
    waterNeeds: "medium",
    plantType: "herb",
    description: "Sweet oregano relative",
  },
  {
    id: 90,
    name: "Lemon Balm",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 3,
    waterNeeds: "medium",
    plantType: "herb",
    description: "Lemony mint family herb",
  },

  // Final additions
  {
    id: 91,
    name: "Dogwood Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 32,
    waterNeeds: "medium",
    plantType: "tree",
    description: "Spring flowering understory tree",
  },
  {
    id: 92,
    name: "Hawthorn Tree",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 29,
    waterNeeds: "low",
    plantType: "tree",
    description: "Small tree with white flowers",
  },
  {
    id: 93,
    name: "Elderberry",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 14,
    waterNeeds: "medium",
    plantType: "shrub",
    description: "Native shrub with edible berries",
  },
  {
    id: 94,
    name: "Serviceberry",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 16,
    waterNeeds: "medium",
    plantType: "shrub",
    description: "Multi-season interest shrub",
  },
  {
    id: 95,
    name: "Ninebark",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 13,
    waterNeeds: "low",
    plantType: "shrub",
    description: "Native shrub with exfoliating bark",
  },
  {
    id: 96,
    name: "Butterfly Bush",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 15,
    waterNeeds: "low",
    plantType: "shrub",
    description: "Attracts butterflies with fragrant flowers",
  },
  {
    id: 97,
    name: "Russian Sage",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 4,
    waterNeeds: "low",
    plantType: "herb",
    description: "Silver-leaved perennial herb",
  },
  {
    id: 98,
    name: "Catmint",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 3,
    waterNeeds: "low",
    plantType: "herb",
    description: "Lavender-blue flowering herb",
  },
  {
    id: 99,
    name: "Hosta",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 4,
    waterNeeds: "medium",
    plantType: "flower",
    description: "Shade perennial with large leaves",
  },
  {
    id: 100,
    name: "Fern",
    image: "/placeholder.svg?height=200&width=200",
    carbonSequestration: 6,
    waterNeeds: "high",
    plantType: "flower",
    description: "Shade-loving non-flowering plant",
  },
]

const getWaterNeedsColor = (waterNeeds: string) => {
  switch (waterNeeds) {
    case "low":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "high":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

export default function PlantRecommendations() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name-asc")
  const [filterWaterNeeds, setFilterWaterNeeds] = useState("all")
  const [filterPlantType, setFilterPlantType] = useState("all")
  const [filterCarbonRange, setFilterCarbonRange] = useState("all")

  const filteredAndSortedPlants = useMemo(() => {
    const filtered = plants.filter((plant) => {
      const matchesSearch =
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesWater = filterWaterNeeds === "all" || plant.waterNeeds === filterWaterNeeds
      const matchesType = filterPlantType === "all" || plant.plantType === filterPlantType
      const matchesCarbon =
        filterCarbonRange === "all" ||
        (filterCarbonRange === "low" && plant.carbonSequestration < 10) ||
        (filterCarbonRange === "medium" && plant.carbonSequestration >= 10 && plant.carbonSequestration < 30) ||
        (filterCarbonRange === "high" && plant.carbonSequestration >= 30)

      return matchesSearch && matchesWater && matchesType && matchesCarbon
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "carbon-high":
          return b.carbonSequestration - a.carbonSequestration
        case "carbon-low":
          return a.carbonSequestration - b.carbonSequestration
        case "water-low":
          const waterOrder = { low: 1, medium: 2, high: 3 }
          return waterOrder[a.waterNeeds] - waterOrder[b.waterNeeds]
        case "water-high":
          const waterOrderDesc = { low: 3, medium: 2, high: 1 }
          return waterOrderDesc[a.waterNeeds] - waterOrderDesc[b.waterNeeds]
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, sortBy, filterWaterNeeds, filterPlantType, filterCarbonRange])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Plant Recommendations</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the perfect plants for your space. Each recommendation includes carbon sequestration data and care
          requirements to help you make an informed choice.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="carbon-high">Carbon High-Low</SelectItem>
                <SelectItem value="carbon-low">Carbon Low-High</SelectItem>
                <SelectItem value="water-low">Water Low-High</SelectItem>
                <SelectItem value="water-high">Water High-Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Water Needs Filter */}
          <div>
            <Select value={filterWaterNeeds} onValueChange={setFilterWaterNeeds}>
              <SelectTrigger>
                <SelectValue placeholder="Water needs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Water Needs</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Plant Type Filter */}
          <div>
            <Select value={filterPlantType} onValueChange={setFilterPlantType}>
              <SelectTrigger>
                <SelectValue placeholder="Plant type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tree">Trees</SelectItem>
                <SelectItem value="shrub">Shrubs</SelectItem>
                <SelectItem value="grass">Grasses</SelectItem>
                <SelectItem value="flower">Flowers</SelectItem>
                <SelectItem value="herb">Herbs</SelectItem>
                <SelectItem value="vine">Vines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Carbon Range Filter */}
          <div>
            <Select value={filterCarbonRange} onValueChange={setFilterCarbonRange}>
              <SelectTrigger>
                <SelectValue placeholder="Carbon range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                <SelectItem value="low">Low (&lt;10 lbs)</SelectItem>
                <SelectItem value="medium">Medium (10-30 lbs)</SelectItem>
                <SelectItem value="high">High (30+ lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span>
            Showing {filteredAndSortedPlants.length} of {plants.length} plants
          </span>
        </div>
      </div>

      {/* Plant Grid - Fixed 3 columns */}
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {filteredAndSortedPlants.map((plant) => (
          <Card key={plant.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={plant.image || "/placeholder.svg"}
                alt={plant.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900">{plant.name}</CardTitle>
                <Badge variant="outline" className="capitalize text-xs">
                  {plant.plantType}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{plant.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Carbon Sequestration */}
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Carbon Capture:</span>
                <span className="text-sm font-semibold text-green-700">{plant.carbonSequestration} lbs CO₂/year</span>
              </div>

              {/* Water Needs */}
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Water Needs:</span>
                <Badge variant="secondary" className={`capitalize ${getWaterNeedsColor(plant.waterNeeds)}`}>
                  {plant.waterNeeds}
                </Badge>
              </div>

              {/* Learn More Button */}
              <Button className="w-full mt-4" variant="default">
                Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results Message */}
      {filteredAndSortedPlants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}