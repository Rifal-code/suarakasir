import CategoryFilter from "@/components/product/CategoryFilter";
import ProductCard from "@/components/product/ProductCard";

export default function ProductsPage() {
  const baseProducts = [
    {
      name: "KASSO Flux Obsidian - Sepatu Sneaker Pria Hitam",
      price: "Rp1.319.000",
      stock: 26,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCavb_zHeecQfbN2n3kYCdBB3dGJGg4K3C1VSIOR668ZwW__YfZgqOEeV6p76cHtKAxVRXt3-IZPoyxpeRMfwkM9cOPyuPoeXfenQCVSrEc87krLpGAuHWKEGl4z_OWX65xVwkAp-l7VJKmIR8bw2pCluZsLje4ZOadz-nGK3zk3coN9Uk_GSg-pgxaoi4plC6hPgb6LlvUJBAyMViD9hcHfH8S4PQYFVMb4vNduXt5093yKaRV8vrgSAPUfb33kGgjfJNXM8jz8_8"
    },
    {
      name: "KASSO Prime Emerald Original Sepatu Lari Hijau",
      price: "Rp1.329.000",
      stock: 41,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBICd5J3WxZsX6ATW5QOnMNAf8ijKUzWuImrXATWY4T9_XFCIDn22mFCaG-xhu2Y6vNr2LrWBztBhXnLGYHThSwnXLlxoJeC1YntoMP__Jawog_SLChOwMIF7tymPSTK7-WxqgD37G_TGcfifjMVXsZY1qOkvlpjG5ZybEtH7xYc61rAZxvkr2N0EbXJQnNjt41L2Q8-vnPR2oYlJW0Xywcz0o1pjAE7D8cJzQKuCiAU_MEMGGhd6K2IlrSvf6wPgKz1x7EEUTvXZA"
    },
    {
      name: "KASSO Core Terra - Sepatu Casual Pria Cokelat",
      price: "Rp1.312.000",
      stock: 8,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3iQxx7Vec5RZq7OJi__5srlRvIl3DfvBd6NUQjg8Q1nCEQlesTL8lLR0t4oB4aeZozuz0G9oT2mPvjD6OUEXFwlNYOSahdxdwlzI5bFQP8DyALQvJEL9xh438KSHz_jA4vokvZV7M_FMwrfJKLdPwE608CfBXbf1jz2FE8VKnbNX1Hj8qz0KGIG1FjdO5KdB7vjfp7KA3t8PJq8-FOb8uAwOelab-F3cmEE1AoG0laXrY_ZF5bLKCXxWzwTINoYUQ3kLlgqgXS3U"
    },
    {
      name: "KASSO Neo Deep Blue - Limited Edition Sneaker",
      price: "Rp1.335.000",
      stock: 22,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaEmHW7etMMOnecJ4h8nhEP8CMKR08E1ADzCkgu-HQhOYXUwCiJoz1B5ccNwS9v0rHm6AoZP-k9MuBy6PEHSCAutcUlgyyuEogMWoHp6EIv05UXF4CtMGKZimUPEAt9IdcKapm2LwohtMTlP__crlFV9D2tPA9a030Z_gdQLfQOFvZB_g2vjT7VFYWZaUYb2d7_CYaXJXhja9U856XFz_PqjsxqU4jI6iqRYD4FtVI8JGKdv9cQCr0Gg6Ds_G6EpusOstwOC8F9N4"
    },
    {
      name: "KASSO Axis Drift - Sepatu Olahraga Pria Abu-abu",
      price: "Rp1.299.000",
      stock: 156,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZP0qxqPI2t2u4llgRP9eggbtudL6HbhKQonVcjHvzXI3kV2cYOky6RrXmn5no8zDc7TCnlLk1-CugyU446bJPwNPpIyjfUyCI2WRfj3BwNWpxp96JMrtWsgYaiBxwNSCKZY1LXh7hEoi8NlIrz0-SXYxWioTzjFnG88wJuHUIIDED0of2X7cfDSnX94rbhTdOe_DgogyJ2fRAzViiJjEFOp14FE1GoyMm3mEg-Ek_HBa3CnDXdISh9Y4g6iLoBD5jAD7VPO7Au0M"
    },
    {
      name: "KASSO Base Arctic White - Sneaker Putih Polos",
      price: "Rp1.324.000",
      stock: 34,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4EeQcUdxxcaYXd1WSCoTX_JWElhtnxMXRDfUhaMlXASxwPf2OQrsNfrzbC0iQUqKzdfQivPVeLsu6DJ1kSPcuW_HbJ_sJrTRggkBazoIan1NTvIpFp2iMSLnRSVDLOH3Dujgy4mu9lnAQv98CcuHceQUvXilXcT0UwgUnBt7arXe0C8jkqD9n_bUgjMyjghF2hsMgf8nTJSLCXRdalol7oLpGkXeCBw5rc0LZuvl68h382Wc8EpmY3lF49jVYkQCmRMQ74RZ4_xs"
    }
  ];

  // Generate 24 products based on the 6 base products
  const products = Array.from({ length: 24 }).map((_, idx) => ({
    ...baseProducts[idx % 6],
    id: idx + 1,
    stock: Math.max(0, baseProducts[idx % 6].stock - (idx * 2)) // Just to vary the stock
  }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1440px] mx-auto">
      {/* Header Area with Filter and Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <CategoryFilter />
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 active:scale-95 transition-all hover:bg-primary-hover w-full md:w-auto">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_box</span>
          Tambah Produk
        </button>
      </div>
      
      {/* 2 cards per row on mobile, up to 6 on very large screens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
