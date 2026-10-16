import type { Product } from "./types";

const SHIRT_SIZES = ["S", "M", "L", "XL"];
const TEE_SIZES = ["S", "M", "L", "XL"];
const BOTTOM_SIZES = ["30", "32", "34", "36"];

export const seedProducts: Product[] = [
  {
    id: "rajasthan-cotton-shirt",
    title: "Rajasthan Cotton Shirt",
    category: "Shirts",
    price: 1013,
    description:
      "Breathable cotton with a crisp, easy drape. Clean collar, everyday polish.",
    fabric: "100% Cotton",
    fit: "Regular Fit",
    tags: ["cotton", "daily", "smart casual"],
    isBestSeller: true,
    variants: [
      {
        id: "olive",
        colorName: "Olive",
        swatch: { type: "solid", value: "#556b2f" },
        // Order requested: Olive first, then Light Blue, then White
        images: [
          "https://i.pinimg.com/736x/18/3d/ce/183dcee124db080c4a881c78640f2926.jpg",
        ],
        sizes: SHIRT_SIZES,
      },
      {
        id: "light-blue",
        colorName: "Light Blue",
        swatch: { type: "solid", value: "#7db7d8" },
        images: [
          "https://www.ethnicrajasthan.com/cdn/shop/articles/ETHNIC_RAJASTHAN_APSHMCCSPPLFL26501SV00M_5.jpg?v=1685188087",
        ],
        sizes: SHIRT_SIZES,
      },
      {
        id: "white",
        colorName: "White",
        swatch: { type: "solid", value: "#ffffff", isLight: true },
        images: [
          "https://tse2.mm.bing.net/th/id/OIP.UPm3nZBG_lGKTx9RpiTDJgHaJ4?pid=ImgDet&w=474&h=632&rs=1&o=7&rm=3",
        ],
        sizes: SHIRT_SIZES,
      },
    ],
  },
  {
    id: "lucknow-linen-shirt",
    title: "Lucknow Linen Shirt",
    category: "Shirts",
    price: 1499,
    description:
      "Lightweight linen feel with a calm, premium finish. Built for warm days.",
    fabric: "Linen Blend",
    fit: "Relaxed Fit",
    tags: ["linen", "summer", "breathable"],
    variants: [
      {
        id: "white",
        colorName: "White",
        swatch: { type: "solid", value: "#ffffff", isLight: true },
        images: [
          "https://ramrajcotton.in/cdn/shop/files/240930_Ramraj-Ecom-01592_1024x.jpg?v=1727931271",
        ],
        sizes: SHIRT_SIZES,
      },
      {
        id: "olive",
        colorName: "Olive",
        swatch: { type: "solid", value: "#556b2f" },
        images: [
          "https://th.bing.com/th/id/R.329fd16b0950654a87852ff2adc14f2a?rik=uQnAGZf2zoiGtA&riu=http%3a%2f%2fshopzhivago.com%2fcdn%2fshop%2ffiles%2fzhivago-men-men-linen-shirt-olive-green-linen-shirt32378052444196.png%3fv%3d1712150766&ehk=u8kGUIpj7sCxxy%2fYKjxSZTgF%2bBCivUt4BY28F6q3f%2fI%3d&risl=&pid=ImgRaw&r=0",
        ],
        sizes: SHIRT_SIZES,
      },
      {
        id: "pink",
        colorName: "Pink",
        swatch: { type: "solid", value: "#e46b9c" },
        images: [
          "https://ramrajcotton.in/cdn/shop/files/240524_ramraj1045_1024x.jpg?v=1718616064",
        ],
        sizes: SHIRT_SIZES,
      },
    ],
  },
  {
    id: "printed-shirt",
    title: "Printed Shirt",
    category: "Shirts",
    price: 1870,
    description:
      "A statement print with controlled contrast. Sharp enough for evenings, easy for days.",
    fabric: "Soft Cotton",
    fit: "Regular Fit",
    tags: ["printed", "occasion", "smart"],
    isNew: true,
    variants: [
      {
        id: "yellow",
        colorName: "Yellow",
        // Treated as a light swatch (border visibility behavior like white)
        swatch: { type: "solid", value: "#f2c300", isLight: true },
        images: [
          "https://chidiyaa.com/cdn/shop/products/IMG_9587_50d3647a-b7a2-41a8-9903-453cf50f4b8e_900x.jpg?v=1670495277",
        ],
        sizes: SHIRT_SIZES,
      },
      {
        id: "multi",
        colorName: "Multi",
        swatch: {
          type: "gradient",
          value:
            "conic-gradient(from 180deg, #f2c300, #ef4444, #3b82f6, #22c55e, #f2c300)",
        },
        images: [
          "https://chidiyaa.com/cdn/shop/products/IMG_9725_9466b3c9-9862-457c-b0a2-d9abfd32aaff_900x.jpg?v=1716978291",
        ],
        sizes: SHIRT_SIZES,
      },
      {
        id: "olive",
        colorName: "Olive",
        swatch: { type: "solid", value: "#556b2f" },
        images: [
          "https://th.bing.com/th/id/R.d30dc78278a483725c92bde95cc7eaa7?rik=jY3z%2fKSiz2NKzw&riu=http%3a%2f%2fintl.nykaafashion.com%2fcdn%2fshop%2fproducts%2fCHIDI00006274_1.jpg%3fv%3d1709553287&ehk=ARstZiIOOyTFE%2bckSwtzs4AMoOUSyKl%2fGxoiuViOQoY%3d&risl=&pid=ImgRaw&r=0",
        ],
        sizes: SHIRT_SIZES,
      },
    ],
  },
  {
    id: "festive-satin-shirt",
    title: "Festive Satin Shirt",
    category: "Shirts",
    price: 900,
    description:
      "Satin sheen with a clean silhouette. Built for weddings, parties, and night lights.",
    fabric: "Satin",
    fit: "Slim Fit",
    tags: ["satin", "festive", "evening"],
    isNew: true,
    variants: [
      {
        id: "blue",
        colorName: "Blue",
        swatch: { type: "solid", value: "#1d4ed8" },
        images: [
          "https://tse3.mm.bing.net/th/id/OIP.Y8705TIFze6MmU2YM6VtkQHaJ3?pid=ImgDet&w=474&h=631&rs=1&o=7&rm=3",
        ],
        sizes: SHIRT_SIZES,
      },
      {
        id: "red",
        colorName: "Red",
        swatch: { type: "solid", value: "#dc2626" },
        images: [
          "https://www.panamerica.studio/cdn/shop/files/4H9A6269.jpg?v=1717995274&width=493",
        ],
        sizes: SHIRT_SIZES,
      },
      {
        id: "purple",
        colorName: "Purple",
        swatch: { type: "solid", value: "#7c3aed" },
        images: [
          "https://www.panamerica.studio/cdn/shop/files/4H9A6209.jpg?v=1717854460&width=493",
        ],
        sizes: SHIRT_SIZES,
      },
    ],
  },

  // Jeans
  {
    id: "cargo-jeans",
    title: "Cargo Jeans",
    category: "Jeans",
    price: 800,
    description:
      "Utility pockets, relaxed structure, and a street-clean finish. Built for daily rotation.",
    fabric: "Denim",
    fit: "Relaxed Fit",
    tags: ["denim", "cargo", "street"],
    isBestSeller: true,
    variants: [
      {
        id: "light-blue",
        colorName: "Light Blue",
        swatch: { type: "solid", value: "#78a6d1" },
        images: [
          "https://tse3.mm.bing.net/th/id/OIP.L7Ql2_Tx9Z8u003YsP0kxQHaJ3?pid=ImgDet&w=474&h=631&rs=1&o=7&rm=3",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "grey",
        colorName: "Grey",
        swatch: { type: "solid", value: "#9ca3af" },
        images: [
          "https://tse4.mm.bing.net/th/id/OIP.na2B92Rhfm99SqJ-RhLtGgHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "black",
        colorName: "Black",
        swatch: { type: "solid", value: "#0b0b0f" },
        images: [
          "https://th.bing.com/th/id/R.81abf279cfba36a6075a8c235623af3e?rik=q6iAp8KpRDpgHg&riu=http%3a%2f%2foffduty.in%2fcdn%2fshop%2ffiles%2f42E375DC-E3E7-459F-95E6-60CD22BBBFE9.jpg%3fv%3d1697894296&ehk=T5qTznjlYyUQCgDVJkYBFC5P2AFepsTZGcF9eIdS6Pk%3d&risl=&pid=ImgRaw&r=0",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "white",
        colorName: "White",
        swatch: { type: "solid", value: "#ffffff", isLight: true },
        images: [
          "https://media.landmarkshops.in/cdn-cgi/image/h=831,w=615,q=85,fit=cover/max-new/1000016006306-White-OFFWHITE-1000016006306_01-2100.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
    ],
  },
  {
    id: "baggy-jeans",
    title: "Baggy Jeans",
    category: "Jeans",
    price: 1031,
    description:
      "Baggy silhouette with a runway-forward fall. Comfortable, bold, and clean.",
    fabric: "Denim",
    fit: "Baggy Fit",
    tags: ["denim", "baggy", "trend"],
    isNew: true,
    variants: [
      {
        id: "ice-blue",
        colorName: "Ice Blue",
        swatch: { type: "solid", value: "#a8c7df", isLight: true },
        images: [
          "https://i.pinimg.com/1200x/31/2f/bb/312fbb6ca351ea7c1fe70e50b8098a31.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "blue",
        colorName: "Blue",
        swatch: { type: "solid", value: "#2f6ea8" },
        images: [
          "https://i.pinimg.com/736x/e8/39/d8/e839d809cd14474827432cd68d18b566.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "pale-grey",
        colorName: "Pale Grey",
        swatch: { type: "solid", value: "#d1d5db", isLight: true },
        images: [
          "https://i.pinimg.com/736x/5b/c5/30/5bc5309b7db86d6a5ae7f4a410abc04c.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "grey",
        colorName: "Grey",
        swatch: { type: "solid", value: "#9ca3af" },
        images: [
          "https://i.pinimg.com/1200x/f4/59/4f/f4594fa6b8ce773a516db3fcaa91df5b.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
    ],
  },
  {
    id: "straight-fit-jeans",
    title: "Straight Fit Jeans",
    category: "Jeans",
    price: 999,
    description:
      "Straight-leg staple with a clean break. Easy to style from day to night.",
    fabric: "Denim",
    fit: "Straight Fit",
    tags: ["denim", "classic", "everyday"],
    isBestSeller: true,
    variants: [
      {
        id: "pale-blue",
        colorName: "Pale Blue",
        swatch: { type: "solid", value: "#87b8dc", isLight: true },
        images: [
          "https://i.pinimg.com/736x/3b/3a/ec/3b3aec08c89d91bab02b5acae6eff3c7.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "medium-blue",
        colorName: "Medium Blue",
        swatch: { type: "solid", value: "#2f6ea8" },
        images: [
          "https://i.pinimg.com/1200x/34/6a/97/346a97c803083b5032d20e20ed554f27.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "blue",
        colorName: "Blue",
        swatch: { type: "solid", value: "#2a5f91" },
        images: [
          "https://i.pinimg.com/736x/cf/7f/d9/cf7fd9a59ec5706a30e260ffe1d52da9.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "black",
        colorName: "Black",
        swatch: { type: "solid", value: "#0b0b0f" },
        images: [
          "https://i.pinimg.com/736x/38/c7/87/38c787edeb5094842d15f6d4ff00c9b5.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
    ],
  },
  {
    id: "distressed-jeans",
    title: "Distressed Jeans",
    category: "Jeans",
    price: 1224,
    description:
      "Controlled distressing for texture without the noise. Premium edge, balanced fit.",
    fabric: "Denim",
    fit: "Straight Fit",
    tags: ["denim", "distressed", "street"],
    variants: [
      {
        id: "light-blue",
        colorName: "Light Blue",
        swatch: { type: "solid", value: "#78a6d1" },
        images: [
          "https://i.pinimg.com/1200x/49/70/2f/49702f5eb1f7e236f8b0f2f578ebb974.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "blue",
        colorName: "Blue",
        swatch: { type: "solid", value: "#2a5f91" },
        images: [
          "https://i.pinimg.com/1200x/65/d0/0d/65d00dfae9149aac1940eb3bb9de3881.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "pale-grey",
        colorName: "Pale Grey",
        swatch: { type: "solid", value: "#d1d5db", isLight: true },
        images: [
          "https://i.pinimg.com/1200x/ce/8a/46/ce8a467d94e7669c3bfd560c14000c40.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "graphite-black",
        colorName: "Graphite Black",
        swatch: { type: "solid", value: "#1f2937" },
        images: [
          "https://i.pinimg.com/1200x/f6/2e/ee/f62eee877847df7805d70254c18f96a0.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
    ],
  },

  // Trousers
  {
    id: "formal-trousers",
    title: "Formal Trousers",
    category: "Trousers",
    price: 999,
    description:
      "Smart tailoring with a clean fall. Office-ready, event-ready, always sharp.",
    fabric: "Poly-Viscose Blend",
    fit: "Tapered Fit",
    tags: ["formal", "tailored", "office"],
    isBestSeller: true,
    variants: [
      {
        id: "grey",
        colorName: "Grey",
        swatch: { type: "solid", value: "#9ca3af" },
        images: [
          "https://th.bing.com/th/id/OPAC.6xqaaF5YvEqgug474C474?w=592&h=550&o=5&dpr=1.3&pid=21.1",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "black",
        colorName: "Black",
        swatch: { type: "solid", value: "#0b0b0f" },
        images: [
          "https://th.bing.com/th/id/OPAC.hFSmXxkEalt8AA474C474?w=592&h=550&o=5&dpr=1.3&pid=21.1",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "cream",
        colorName: "Cream",
        swatch: { type: "solid", value: "#f2e6cf", isLight: true },
        images: [
          "https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_100,w_1080/v1/assets/images/21170834/2023/1/9/10099b4d-bee2-4fd1-9a99-a60bcdae03751673240621603-Arrow-Men-Trousers-1991673240620972-1.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "light-blue",
        colorName: "Light Blue",
        swatch: { type: "solid", value: "#7db7d8" },
        images: [
          "https://www.jiomart.com/images/product/500x630/rvqvzg3wql/mancrew-regular-fit-men-sky-blue-single-formal-trousers-product-images-rvqvzg3wql-0-202306280540.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
    ],
  },
  {
    id: "linen-pants",
    title: "Linen Pants",
    category: "Trousers",
    price: 899,
    description:
      "Easy linen texture with a relaxed premium fall. Clean enough, comfortable always.",
    fabric: "Linen Blend",
    fit: "Relaxed Fit",
    tags: ["linen", "summer", "casual"],
    isNew: true,
    variants: [
      {
        id: "white",
        colorName: "White",
        swatch: { type: "solid", value: "#ffffff", isLight: true },
        images: [
          "https://i.pinimg.com/1200x/98/43/ea/9843eabd475284318e73b26c5d55b524.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "cream",
        colorName: "Cream",
        swatch: { type: "solid", value: "#f2e6cf", isLight: true },
        images: [
          "https://i.pinimg.com/736x/eb/34/e6/eb34e6a40b9297ce011379bc9199a4a1.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "olive",
        colorName: "Olive",
        swatch: { type: "solid", value: "#556b2f" },
        images: [
          "https://www.diyanu.com/cdn/shop/files/Mens-Asan-Linen-Pants-Olive2_1.jpg?v=1715104104&width=791",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "brown",
        colorName: "Brown",
        swatch: { type: "solid", value: "#7a4b2b" },
        images: [
          "https://i.pinimg.com/1200x/a2/9d/92/a29d92ac5a01da3c08ab1eb87e24ece6.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
    ],
  },
  {
    id: "casual-trousers",
    title: "Casual Trousers",
    category: "Trousers",
    price: 1999,
    description:
      "Everyday trousers with a clean, premium finish. Easy comfort, sharp outline.",
    fabric: "Cotton Blend",
    fit: "Regular Fit",
    tags: ["casual", "daily", "comfort"],
    variants: [
      {
        id: "grey",
        colorName: "Grey",
        swatch: { type: "solid", value: "#9ca3af" },
        images: [
          "https://i.pinimg.com/736x/79/4a/44/794a444c0121236c0f01142569a7e3e1.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "black",
        colorName: "Black",
        swatch: { type: "solid", value: "#0b0b0f" },
        images: [
          "https://i.pinimg.com/736x/9b/a5/2d/9ba52dd0a58b36eaad527990cdb7f7f6.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "brown",
        colorName: "Brown",
        swatch: { type: "solid", value: "#7a4b2b" },
        images: [
          "https://i.pinimg.com/1200x/38/04/f9/3804f9ed774bce6d1c05c79c3089278d.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "light-cream",
        colorName: "Light Cream",
        swatch: { type: "solid", value: "#f5ead6", isLight: true },
        images: [
          "https://i.pinimg.com/736x/fd/0f/02/fd0f02cd32a96d13bb83f91dd3d40bd0.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
    ],
  },
  {
    id: "regular-fit-trousers",
    title: "Regular Fit Trousers",
    category: "Trousers",
    price: 999,
    description:
      "A clean regular fit with a tailored feel. Made to look sharp without trying.",
    fabric: "Cotton Blend",
    fit: "Regular Fit",
    tags: ["regular", "tailored", "smart"],
    variants: [
      {
        id: "cream",
        colorName: "Cream",
        swatch: { type: "solid", value: "#f2e6cf", isLight: true },
        images: [
          "https://i5.walmartimages.com/asr/fa6a59a8-d643-42e6-bad6-3a8bec950bfd_1.8ace1fd7ad3d2696832612718b6f9cf9.jpeg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "black",
        colorName: "Black",
        swatch: { type: "solid", value: "#0b0b0f" },
        images: [
          "https://i.pinimg.com/736x/2d/f2/a3/2df2a34067dc59b2697fdee783f37cad.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "white",
        colorName: "White",
        swatch: { type: "solid", value: "#ffffff", isLight: true },
        images: [
          "https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_100,w_1080/v1/assets/images/17391492/2022/3/4/5d22ec79-33d0-498f-ae2a-408d92a7322c1646387372394SolemioMenWhiteRelaxedTrousers1.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "light-yellowish-brown",
        colorName: "Light Yellowish Brown",
        swatch: { type: "solid", value: "#d8b27d", isLight: true },
        images: [
          "https://i5.walmartimages.com/asr/1d2255fe-bcfa-454c-bd24-a53799a1af95_1.9af4596880055d4db04e17e3532877d3.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        ],
        sizes: BOTTOM_SIZES,
      },
    ],
  },

  // Others
  {
    id: "t-shirt",
    title: "T-shirt",
    category: "Others",
    price: 899,
    description:
      "Clean, heavyweight tee with a premium fall. Made to wear on repeat.",
    fabric: "Cotton",
    fit: "Regular Fit",
    tags: ["t-shirt", "daily", "essential"],
    isBestSeller: true,
    variants: [
      {
        id: "white",
        colorName: "White",
        swatch: { type: "solid", value: "#ffffff", isLight: true },
        images: [
          "https://i.pinimg.com/736x/b4/37/1b/b4371b30437b0cbb1e920069fce2b069.jpg",
        ],
        sizes: TEE_SIZES,
      },
      {
        id: "olive",
        colorName: "Olive",
        swatch: { type: "solid", value: "#556b2f" },
        images: [
          "https://i.pinimg.com/736x/49/c0/bc/49c0bcd4e84b1f32afff9a48b7dbd7b3.jpg",
        ],
        sizes: TEE_SIZES,
      },
      {
        id: "pitch",
        colorName: "Pitch",
        swatch: { type: "solid", value: "#f1b39b", isLight: true },
        images: [
          "https://i.pinimg.com/736x/3c/69/1f/3c691f7e58b0d9d733bea0656795032a.jpg",
        ],
        sizes: TEE_SIZES,
      },
    ],
  },
  {
    id: "jogger",
    title: "Jogger",
    category: "Others",
    price: 1819,
    description:
      "Comfort-first joggers with a premium shape. Clean lines, effortless wear.",
    fabric: "Cotton Blend",
    fit: "Relaxed Fit",
    tags: ["jogger", "comfort", "street"],
    isNew: true,
    variants: [
      {
        id: "grey",
        colorName: "Grey",
        swatch: { type: "solid", value: "#9ca3af" },
        images: [
          "https://i.pinimg.com/736x/72/5b/77/725b77cf1f40d0666beea3c7496273fd.jpg",
        ],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: "cream",
        colorName: "Cream",
        swatch: { type: "solid", value: "#f2e6cf", isLight: true },
        images: [
          "https://images.bewakoof.com/original/men-s-beige-cargo-joggers-604812-1690303964-1.jpg",
        ],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: "yellowish",
        colorName: "Yellowish",
        swatch: { type: "solid", value: "#d8b27d", isLight: true },
        images: [
          "https://i.pinimg.com/736x/e6/5f/f7/e65ff736cad0370d9155832771b4e985.jpg",
        ],
        sizes: ["S", "M", "L", "XL"],
      },
    ],
  },

  {
    id: "shorts",
    title: "Shorts",
    category: "Others",
    price: 999,
    description:
      "Clean shorts with a tailored waist. Easy movement, premium finish.",
    fabric: "Cotton",
    fit: "Regular Fit",
    tags: ["shorts", "summer", "daily"],
    variants: [
      {
        id: "white",
        colorName: "White",
        swatch: { type: "solid", value: "#ffffff", isLight: true },
        images: [
          "https://i.pinimg.com/1200x/e1/e1/ac/e1e1ace8ce1be1b459a46f7a78ab4b72.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "light-blue",
        colorName: "Light Blue",
        swatch: { type: "solid", value: "#7db7d8" },
        images: [
          "https://i.pinimg.com/1200x/3c/61/5f/3c615fa55800f8f1defa42261f7903d2.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
      {
        id: "grey",
        colorName: "Grey",
        swatch: { type: "solid", value: "#9ca3af" },
        images: [
          "https://i.pinimg.com/1200x/23/78/72/23787276c23b5ecb9dcdb922c3cbd2a1.jpg",
        ],
        sizes: BOTTOM_SIZES,
      },
    ],
  },
];

export const categoriesInOrder = ["Shirts", "Jeans", "Trousers", "Others"] as const;

export const couponPresets: Array<{ code: string; label: string; pctOff: number }> = [
  { code: "DHAKAD10", label: "10% off",
    pctOff: 10 },
  { code: "INDORE5", label: "5% off",
    pctOff: 5 },
];


