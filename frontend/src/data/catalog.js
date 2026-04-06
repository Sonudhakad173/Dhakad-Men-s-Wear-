export const CATEGORY_ORDER = ["Shirts", "Jeans", "Trousers", "Others"];

export const SWATCHES = {
  black: { type: "solid", value: "#0b0b0c" },
  white: { type: "solid", value: "#ffffff", isLight: true },
  grey: { type: "solid", value: "#9ca3af" },
  paleGrey: { type: "solid", value: "#d1d5db", isLight: true },
  graphiteBlack: { type: "solid", value: "#111827" },
  cream: { type: "solid", value: "#f3e9d2", isLight: true },
  lightCream: { type: "solid", value: "#f5f0e6", isLight: true },
  brown: { type: "solid", value: "#8b5a2b" },
  olive: { type: "solid", value: "#556b2f" },
  lightBlue: { type: "solid", value: "#86b9e6", isLight: true },
  iceBlue: { type: "solid", value: "#bfe3ff", isLight: true },
  blue: { type: "solid", value: "#2563eb" },
  mediumBlue: { type: "solid", value: "#1d4ed8" },
  red: { type: "solid", value: "#b91c1c" },
  purple: { type: "solid", value: "#7c3aed" },
  pink: { type: "solid", value: "#ec4899", isLight: true },
  yellow: { type: "solid", value: "#f2c300", isLight: true },
  pitch: { type: "solid", value: "#f4b6a8", isLight: true },
  yellowish: { type: "solid", value: "#e6c07b", isLight: true },
  multi: {
    type: "gradient",
    value:
      "linear-gradient(90deg, #f2c300 0%, #16a34a 35%, #2563eb 70%, #db2777 100%)",
  },
};

export const BASE_PRODUCTS = [
  {
    id: "rajasthan-cotton-shirt",
    title: "Rajasthan Cotton Shirt",
    category: "Shirts",
    price: 1013,
    compareAt: 2019,
    fabric: "Cotton",
    fit: "Regular",
    isNew: true,
    isBestSeller: true,
    sizes: ["S", "M", "L", "XL"],
    variants: [
      {
        id: "olive",
        colorName: "Olive",
        swatch: SWATCHES.olive,
        images: [
          "https://i.pinimg.com/736x/18/3d/ce/183dcee124db080c4a881c78640f2926.jpg",
        ],
      },
      {
        id: "light-blue",
        colorName: "Light Blue",
        swatch: SWATCHES.lightBlue,
        images: [
          "https://www.ethnicrajasthan.com/cdn/shop/articles/ETHNIC_RAJASTHAN_APSHMCCSPPLFL26501SV00M_5.jpg?v=1685188087",
        ],
      },
      {
        id: "white",
        colorName: "White",
        swatch: SWATCHES.white,
        images: [
          "https://tse2.mm.bing.net/th/id/OIP.UPm3nZBG_lGKTx9RpiTDJgHaJ4?pid=ImgDet&w=474&h=632&rs=1&o=7&rm=3",
        ],
      },
    ],
    description:
      "A clean Rajasthan cotton weave with a crisp handfeelâ€”designed for everyday confidence.",
  },
  {
    id: "lucknow-linen-shirt",
    title: "Lucknow Linen Shirt",
    category: "Shirts",
    price: 1399,
    compareAt: 2499,
    fabric: "Linen",
    fit: "Relaxed",
    isNew: true,
    isBestSeller: true,
    sizes: ["S", "M", "L", "XL"],
    variants: [
      {
        id: "white",
        colorName: "White",
        swatch: SWATCHES.white,
        images: [
          "https://ramrajcotton.in/cdn/shop/files/240930_Ramraj-Ecom-01592_1024x.jpg?v=1727931271",
        ],
      },
      {
        id: "olive",
        colorName: "Olive",
        swatch: SWATCHES.olive,
        images: [
          "https://th.bing.com/th/id/OIP.aVsC6LE4Fuedx1qWY9Uh9wHaJ4?w=208&h=277&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        ],
      },
      {
        id: "pink",
        colorName: "Pink",
        swatch: SWATCHES.pink,
        images: [
          "https://ramrajcotton.in/cdn/shop/files/240524_ramraj1045_1024x.jpg?v=1718616064",
        ],
      },
    ],
    description:
      "Breathable linen with a refined drapeâ€”made to look sharp, even when worn effortlessly.",
  },
  {
    id: "printed-shirt",
    title: "Printed Shirt",
    category: "Shirts",
    price: 1870,
    compareAt: 2099,
    fabric: "Cotton",
    fit: "Regular",
    isNew: true,
    isBestSeller: true,
    sizes: ["S", "M", "L", "XL"],
    variants: [
      {
        id: "yellow",
        colorName: "Yellow",
        swatch: SWATCHES.yellow,
        images: [
          "https://chidiyaa.com/cdn/shop/products/IMG_9587_50d3647a-b7a2-41a8-9903-453cf50f4b8e_900x.jpg?v=1670495277",
        ],
      },
      {
        id: "multi",
        colorName: "Multi",
        swatch: SWATCHES.multi,
        images: [
          "https://chidiyaa.com/cdn/shop/products/IMG_9725_9466b3c9-9862-457c-b0a2-d9abfd32aaff_900x.jpg?v=1716978291",
        ],
      },
      {
        id: "olive",
        colorName: "Olive",
        swatch: SWATCHES.olive,
        images: [
          "https://th.bing.com/th/id/R.d30dc78278a483725c92bde95cc7eaa7?rik=jY3z%2fKSiz2NKzw&riu=http%3a%2f%2fintl.nykaafashion.com%2fcdn%2fshop%2fproducts%2fCHIDI00006274_1.jpg%3fv%3d1709553287&ehk=ARstZiIOOyTFE%2bckSwtzs4AMoOUSyKl%2fGxoiuViOQoY%3d&risl=&pid=ImgRaw&r=0",
        ],
      },
    ],
    description:
      "Statement prints with a premium finishâ€”balanced for day-to-night styling.",
  },
  {
    id: "festive-satin-shirt",
    title: "Festive Satin Shirt",
    category: "Shirts",
    price: 900,
    compareAt: 2399,
    fabric: "Satin",
    fit: "Slim",
    isNew: false,
    isBestSeller: true,
    sizes: ["S", "M", "L", "XL"],
    variants: [
      {
        id: "blue",
        colorName: "Blue",
        swatch: SWATCHES.blue,
        images: [
          "https://tse3.mm.bing.net/th/id/OIP.Y8705TIFze6MmU2YM6VtkQHaJ3?pid=ImgDet&w=474&h=631&rs=1&o=7&rm=3",
        ],
      },
      {
        id: "red",
        colorName: "Red",
        swatch: SWATCHES.red,
        images: [
          "https://www.panamerica.studio/cdn/shop/files/4H9A6269.jpg?v=1717995274&width=493",
        ],
      },
      {
        id: "purple",
        colorName: "Purple",
        swatch: SWATCHES.purple,
        images: [
          "https://www.panamerica.studio/cdn/shop/files/4H9A6209.jpg?v=1717854460&width=493",
        ],
      },
    ],
    description:
      "A subtle satin sheen for festive nightsâ€”bold without being loud.",
  },

  {
    id: "cargo-jeans",
    title: "Cargo Jeans",
    category: "Jeans",
    price: 800,
    compareAt: 2599,
    fabric: "Denim",
    fit: "Relaxed",
    isNew: true,
    isBestSeller: true,
    sizes: ["28", "30", "32", "34", "36"],
    variants: [
      {
        id: "light-blue",
        colorName: "Light Blue",
        swatch: SWATCHES.lightBlue,
        images: [
          "https://tse3.mm.bing.net/th/id/OIP.L7Ql2_Tx9Z8u003YsP0kxQHaJ3?pid=ImgDet&w=474&h=631&rs=1&o=7&rm=3",
        ],
      },
      {
        id: "grey",
        colorName: "Grey",
        swatch: SWATCHES.grey,
        images: [
          "https://tse4.mm.bing.net/th/id/OIP.na2B92Rhfm99SqJ-RhLtGgHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3",
        ],
      },
      {
        id: "black",
        colorName: "Black",
        swatch: SWATCHES.black,
        images: [
          "https://th.bing.com/th/id/R.81abf279cfba36a6075a8c235623af3e?rik=q6iAp8KpRDpgHg&riu=http%3a%2f%2foffduty.in%2fcdn%2fshop%2ffiles%2f42E375DC-E3E7-459F-95E6-60CD22BBBFE9.jpg%3fv%3d1697894296&ehk=T5qTznjlYyUQCgDVJkYBFC5P2AFepsTZGcF9eIdS6Pk%3d&risl=&pid=ImgRaw&r=0",
        ],
      },
      {
        id: "white",
        colorName: "White",
        swatch: SWATCHES.white,
        images: [
          "https://media.landmarkshops.in/cdn-cgi/image/h=831,w=615,q=85,fit=cover/max-new/1000016006306-White-OFFWHITE-1000016006306_01-2100.jpg",
        ],
      },
    ],
    description:
      "Utility silhouette with modern structureâ€”built for movement and street-ready styling.",
  },
  {
    id: "baggy-jeans",
    title: "Baggy Jeans",
    category: "Jeans",
    price: 1031,
    compareAt: 2799,
    fabric: "Denim",
    fit: "Baggy",
    isNew: false,
    isBestSeller: true,
    sizes: ["28", "30", "32", "34", "36"],
    variants: [
      {
        id: "ice-blue",
        colorName: "Ice Blue",
        swatch: SWATCHES.iceBlue,
        images: ["https://i.pinimg.com/1200x/31/2f/bb/312fbb6ca351ea7c1fe70e50b8098a31.jpg"],
      },
      {
        id: "blue",
        colorName: "Blue",
        swatch: SWATCHES.blue,
        images: ["https://i.pinimg.com/736x/e8/39/d8/e839d809cd14474827432cd68d18b566.jpg"],
      },
      {
        id: "pale-grey",
        colorName: "Pale Grey",
        swatch: SWATCHES.paleGrey,
        images: ["https://i.pinimg.com/736x/5b/c5/30/5bc5309b7db86d6a5ae7f4a410abc04c.jpg"],
      },
      {
        id: "grey",
        colorName: "Grey",
        swatch: SWATCHES.grey,
        images: ["https://i.pinimg.com/1200x/f4/59/4f/f4594fa6b8ce773a516db3fcaa91df5b.jpg"],
      },
    ],
    description:
      "A roomy baggy cut with premium weightâ€”clean, bold, and runway-ready.",
  },
  {
    id: "straight-fit-jeans",
    title: "Straight Fit Jeans",
    category: "Jeans",
    price: 999,
    compareAt: 2699,
    fabric: "Denim",
    fit: "Straight",
    isNew: false,
    isBestSeller: false,
    sizes: ["28", "30", "32", "34", "36"],
    variants: [
      {
        id: "pale-blue",
        colorName: "Pale Blue",
        swatch: SWATCHES.iceBlue,
        images: ["https://i.pinimg.com/736x/3b/3a/ec/3b3aec08c89d91bab02b5acae6eff3c7.jpg"],
      },
      {
        id: "medium-blue",
        colorName: "Medium Blue",
        swatch: SWATCHES.mediumBlue,
        images: ["https://i.pinimg.com/1200x/34/6a/97/346a97c803083b5032d20e20ed554f27.jpg"],
      },
      {
        id: "blue",
        colorName: "Blue",
        swatch: SWATCHES.blue,
        images: ["https://i.pinimg.com/736x/cf/7f/d9/cf7fd9a59ec5706a30e260ffe1d52da9.jpg"],
      },
      {
        id: "black",
        colorName: "Black",
        swatch: SWATCHES.black,
        images: ["https://i.pinimg.com/736x/38/c7/87/38c787edeb5094842d15f6d4ff00c9b5.jpg"],
      },
    ],
    description:
      "Straight fit with a clean lineâ€”sharp enough for evenings, easy enough for everyday.",
  },
  {
    id: "distressed-jeans",
    title: "Distressed Jeans",
    category: "Jeans",
    price: 1224,
    compareAt: 2899,
    fabric: "Denim",
    fit: "Tapered",
    isNew: true,
    isBestSeller: false,
    sizes: ["28", "30", "32", "34", "36"],
    variants: [
      {
        id: "light-blue",
        colorName: "Light Blue",
        swatch: SWATCHES.lightBlue,
        images: ["https://i.pinimg.com/1200x/49/70/2f/49702f5eb1f7e236f8b0f2f578ebb974.jpg"],
      },
      {
        id: "blue",
        colorName: "Blue",
        swatch: SWATCHES.blue,
        images: ["https://i.pinimg.com/1200x/65/d0/0d/65d00dfae9149aac1940eb3bb9de3881.jpg"],
      },
      {
        id: "pale-grey",
        colorName: "Pale Grey",
        swatch: SWATCHES.paleGrey,
        images: ["https://i.pinimg.com/1200x/ce/8a/46/ce8a467d94e7669c3bfd560c14000c40.jpg"],
      },
      {
        id: "graphite-black",
        colorName: "Graphite Black",
        swatch: SWATCHES.graphiteBlack,
        images: ["https://i.pinimg.com/1200x/f6/2e/ee/f62eee877847df7805d70254c18f96a0.jpg"],
      },
    ],
    description:
      "Distressed texture, premium cutâ€”built to stand out with understated power.",
  },

  {
    id: "formal-trousers",
    title: "Formal Trousers",
    category: "Trousers",
    price: 999,
    compareAt: 2499,
    fabric: "Formal weave",
    fit: "Tailored",
    isNew: true,
    isBestSeller: true,
    sizes: ["28", "30", "32", "34", "36"],
    variants: [
      {
        id: "grey",
        colorName: "Grey",
        swatch: SWATCHES.grey,
        images: [
          "https://th.bing.com/th/id/OPAC.6xqaaF5YvEqgug474C474?w=592&h=550&o=5&dpr=1.3&pid=21.1",
        ],
      },
      {
        id: "black",
        colorName: "Black",
        swatch: SWATCHES.black,
        images: [
          "https://th.bing.com/th/id/OPAC.hFSmXxkEalt8AA474C474?w=592&h=550&o=5&dpr=1.3&pid=21.1",
        ],
      },
      {
        id: "cream",
        colorName: "Cream",
        swatch: SWATCHES.cream,
        images: [
          "https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_100,w_1080/v1/assets/images/21170834/2023/1/9/10099b4d-bee2-4fd1-9a99-a60bcdae03751673240621603-Arrow-Men-Trousers-1991673240620972-1.jpg",
        ],
      },
      {
        id: "light-blue",
        colorName: "Light Blue",
        swatch: SWATCHES.lightBlue,
        images: [
          "https://www.jiomart.com/images/product/500x630/rvqvzg3wql/mancrew-regular-fit-men-sky-blue-single-formal-trousers-product-images-rvqvzg3wql-0-202306280540.jpg",
        ],
      },
    ],
    description:
      "Tailored structure with a clean finishâ€”made for sharp everyday and occasion styling.",
  },
  {
    id: "linen-pants",
    title: "Linen Pants",
    category: "Trousers",
    price: 899,
    compareAt: 2299,
    fabric: "Linen",
    fit: "Relaxed",
    isNew: false,
    isBestSeller: true,
    sizes: ["28", "30", "32", "34", "36"],
    variants: [
      {
        id: "white",
        colorName: "White",
        swatch: SWATCHES.white,
        images: ["https://i.pinimg.com/1200x/98/43/ea/9843eabd475284318e73b26c5d55b524.jpg"],
      },
      {
        id: "cream",
        colorName: "Cream",
        swatch: SWATCHES.cream,
        images: ["https://i.pinimg.com/736x/eb/34/e6/eb34e6a40b9297ce011379bc9199a4a1.jpg"],
      },
      {
        id: "olive",
        colorName: "Olive",
        swatch: SWATCHES.olive,
        images: [
          "https://www.diyanu.com/cdn/shop/files/Mens-Asan-Linen-Pants-Olive2_1.jpg?v=1715104104&width=791",
        ],
      },
      {
        id: "brown",
        colorName: "Brown",
        swatch: SWATCHES.brown,
        images: ["https://i.pinimg.com/1200x/a2/9d/92/a29d92ac5a01da3c08ab1eb87e24ece6.jpg"],
      },
    ],
    description:
      "Lightweight linen with a premium drapeâ€”summer-ready, always refined.",
  },
  {
    id: "casual-trousers",
    title: "Casual Trousers",
    category: "Trousers",
    price: 1999,
    compareAt: 2599,
    fabric: "Cotton blend",
    fit: "Regular",
    isNew: false,
    isBestSeller: true,
    sizes: ["28", "30", "32", "34", "36"],
    variants: [
      {
        id: "grey",
        colorName: "Grey",
        swatch: SWATCHES.grey,
        images: ["https://i.pinimg.com/736x/79/4a/44/794a444c0121236c0f01142569a7e3e1.jpg"],
      },
      {
        id: "black",
        colorName: "Black",
        swatch: SWATCHES.black,
        images: ["https://i.pinimg.com/736x/9b/a5/2d/9ba52dd0a58b36eaad527990cdb7f7f6.jpg"],
      },
      {
        id: "brown",
        colorName: "Brown",
        swatch: SWATCHES.brown,
        images: ["https://i.pinimg.com/1200x/38/04/f9/3804f9ed774bce6d1c05c79c3089278d.jpg"],
      },
      {
        id: "light-cream",
        colorName: "Light Cream",
        swatch: SWATCHES.lightCream,
        images: ["https://i.pinimg.com/736x/fd/0f/02/fd0f02cd32a96d13bb83f91dd3d40bd0.jpg"],
      },
    ],
    description:
      "Everyday trousers with a premium finishâ€”minimal look, maximum versatility.",
  },
  {
    id: "regular-fit-trousers",
    title: "Regular Fit Trousers",
    category: "Trousers",
    price: 999,
    compareAt: 2799,
    fabric: "Everyday weave",
    fit: "Regular",
    isNew: false,
    isBestSeller: false,
    sizes: ["28", "30", "32", "34", "36"],
    variants: [
      {
        id: "cream",
        colorName: "Cream",
        swatch: SWATCHES.cream,
        images: [
          "https://i5.walmartimages.com/asr/fa6a59a8-d643-42e6-bad6-3a8bec950bfd_1.8ace1fd7ad3d2696832612718b6f9cf9.jpeg",
        ],
      },
      {
        id: "black",
        colorName: "Black",
        swatch: SWATCHES.black,
        images: ["https://i.pinimg.com/736x/2d/f2/a3/2df2a34067dc59b2697fdee783f37cad.jpg"],
      },
      {
        id: "white",
        colorName: "White",
        swatch: SWATCHES.white,
        images: [
          "https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_100,w_1080/v1/assets/images/17391492/2022/3/4/5d22ec79-33d0-498f-ae2a-408d92a7322c1646387372394SolemioMenWhiteRelaxedTrousers1.jpg",
        ],
      },
      {
        id: "yellowish",
        colorName: "Light Yellowish Brown",
        swatch: SWATCHES.yellowish,
        images: [
          "https://i5.walmartimages.com/asr/1d2255fe-bcfa-454c-bd24-a53799a1af95_1.9af4596880055d4db04e17e3532877d3.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
        ],
      },
    ],
    description:
      "Balanced structure and easy comfortâ€”your everyday premium fit.",
  },

  {
    id: "t-shirt",
    title: "T-shirt",
    category: "Others",
    price: 899,
    compareAt: 3299,
    fabric: "Cotton jersey",
    fit: "Regular",
    isNew: true,
    isBestSeller: false,
    sizes: ["S", "M", "L", "XL"],
    variants: [
      {
        id: "white",
        colorName: "White",
        swatch: SWATCHES.white,
        images: ["https://i.pinimg.com/736x/b4/37/1b/b4371b30437b0cbb1e920069fce2b069.jpg"],
      },
      {
        id: "olive",
        colorName: "Olive",
        swatch: SWATCHES.olive,
        images: ["https://i.pinimg.com/736x/49/c0/bc/49c0bcd4e84b1f32afff9a48b7dbd7b3.jpg"],
      },
      {
        id: "pitch",
        colorName: "Pitch",
        swatch: SWATCHES.pitch,
        images: ["https://i.pinimg.com/736x/3c/69/1f/3c691f7e58b0d9d733bea0656795032a.jpg"],
      },
    ],
    description:
      "Clean essentials with a premium handfeelâ€”built to layer, built to last.",
  },
  {
    id: "jogger",
    title: "Jogger",
    category: "Others",
    price: 1819,
    compareAt: 3899,
    fabric: "Cotton blend",
    fit: "Relaxed",
    isNew: false,
    isBestSeller: true,
    sizes: ["S", "M", "L", "XL"],
    variants: [
      {
        id: "grey",
        colorName: "Grey",
        swatch: SWATCHES.grey,
        images: ["https://i.pinimg.com/736x/72/5b/77/725b77cf1f40d0666beea3c7496273fd.jpg"],
      },
      {
        id: "cream",
        colorName: "Cream",
        swatch: SWATCHES.cream,
        images: [
          "https://images.bewakoof.com/original/men-s-beige-cargo-joggers-604812-1690303964-1.jpg",
        ],
      },
      {
        id: "yellowish",
        colorName: "Yellowish",
        swatch: SWATCHES.yellowish,
        images: ["https://i.pinimg.com/736x/e6/5f/f7/e65ff736cad0370d9155832771b4e985.jpg"],
      },
    ],
    description:
      "Relaxed comfort with a premium silhouetteâ€”clean, minimal, and modern.",
  },
  {
    id: "shorts",
    title: "Shorts",
    category: "Others",
    price: 999,
    compareAt: 3499,
    fabric: "Cotton",
    fit: "Regular",
    isNew: false,
    isBestSeller: false,
    sizes: ["S", "M", "L", "XL"],
    variants: [
      {
        id: "white",
        colorName: "White",
        swatch: SWATCHES.white,
        images: ["https://i.pinimg.com/1200x/e1/e1/ac/e1e1ace8ce1be1b459a46f7a78ab4b72.jpg"],
      },
      {
        id: "light-blue",
        colorName: "Light Blue",
        swatch: SWATCHES.lightBlue,
        images: ["https://i.pinimg.com/1200x/3c/61/5f/3c615fa55800f8f1defa42261f7903d2.jpg"],
      },
      {
        id: "grey",
        colorName: "Grey",
        swatch: SWATCHES.grey,
        images: ["https://i.pinimg.com/1200x/23/78/72/23787276c23b5ecb9dcdb922c3cbd2a1.jpg"],
      },
    ],
    description:
      "Warm-weather essentials with a refined cutâ€”minimal look, premium comfort.",
  },
];

export function getDefaultVariant(product) {
  return product.variants?.[0] ?? null;
}

export function findVariant(product, variantId) {
  return product.variants.find((v) => v.id === variantId) ?? null;
}

export function getProductImage(product, variantId) {
  const variant = variantId ? findVariant(product, variantId) : getDefaultVariant(product);
  return variant?.images?.[0] ?? "";
}
