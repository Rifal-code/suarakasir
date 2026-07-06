"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api";
import { motion, useScroll, useTransform } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUp: any = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const scaleUp: any = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, type: "spring", bounce: 0.4 } }
};

const slideInRight: any = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideInLeft: any = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function WelcomePage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  
  // Parallax for Hero
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const yBg = useTransform(heroScroll, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    // Check if already logged in, redirect to dashboard if so
    if (getAuthToken()) {
      router.replace("/dashboard");
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary/20 selection:text-primary overflow-x-hidden font-sans">
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
              <span className="material-symbols-outlined text-white text-lg">bolt</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Suara Kasir</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button onClick={() => scrollToSection('home')} className="text-text-secondary hover:text-primary transition-colors">Beranda</button>
            <button onClick={() => scrollToSection('features')} className="text-text-secondary hover:text-primary transition-colors">Fitur</button>
            <button onClick={() => scrollToSection('idcamp')} className="text-text-secondary hover:text-primary transition-colors">Tentang Proyek</button>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block px-5 py-2.5 text-sm font-bold text-text-primary hover:text-primary transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="hidden sm:inline-flex px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              Coba Gratis
            </Link>
            <Link href="/login" className="sm:hidden px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              Masuk
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section Redesign */}
      <section id="home" ref={heroRef} className="pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto relative">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="relative w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-sidebar flex flex-col justify-center min-h-[550px] md:min-h-[700px] shadow-2xl group"
        >
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.img 
              style={{ y: yBg }}
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=2000" 
              alt="Background" 
              className="w-full h-[130%] object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s] ease-out -top-[15%]"
            />
            {/* Dark gradient overlay so white text is readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
          </div>

          {/* Main Content (Left) */}
          <div className="relative z-10 p-8 md:p-16 lg:p-24 flex flex-col items-start max-w-3xl">
            <motion.p variants={slideInLeft} className="text-white/80 font-medium tracking-wide mb-4">
              #1 Sistem POS Berbasis Kecerdasan Buatan
            </motion.p>
            <motion.h1 variants={slideInLeft} className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6">
              Revolusi Sistem<br />Kasir Anda.
            </motion.h1>
            <motion.p variants={slideInLeft} className="text-lg text-white/90 mb-10 max-w-xl">
              Tinggalkan input manual yang lambat. Proses pesanan dalam hitungan detik hanya dengan suara. Cepat, akurat, dan profesional untuk UMKM modern.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-8">
              <Link href="/login" className="flex items-center gap-2 text-white font-bold text-lg hover:text-primary transition-colors group/link">
                Coba Gratis Sekarang
                <span className="material-symbols-outlined text-sm group-hover/link:-translate-y-1 group-hover/link:translate-x-1 transition-transform">arrow_outward</span>
              </Link>
              <button onClick={() => scrollToSection('features')} className="flex items-center gap-2 text-white/80 font-semibold text-lg hover:text-white transition-colors group/link">
                Lihat Fitur Kami
                <span className="material-symbols-outlined text-sm group-hover/link:-translate-y-1 group-hover/link:translate-x-1 transition-transform">arrow_outward</span>
              </button>
            </motion.div>
          </div>

          {/* Floating Glass Card (Right side) */}
          <motion.div 
            variants={scaleUp}
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute top-1/2 -translate-y-1/2 right-12 lg:right-32 hidden md:block"
          >
            <div className="w-64 aspect-square rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group/card cursor-pointer hover:bg-white/20 transition-colors">
              <div className="flex justify-end">
                <span className="material-symbols-outlined text-white/80">more_horiz</span>
              </div>
              <div>
                 <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover/card:scale-110 transition-transform">
                   <span className="material-symbols-outlined text-white">mic</span>
                 </div>
                 <p className="text-white font-bold">Cobalah Demo</p>
                 <p className="text-white/70 text-sm">AI Voice Order</p>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cutout at Bottom Right */}
          <motion.div variants={fadeUp} className="absolute bottom-0 right-0 bg-background rounded-tl-[3rem] pl-10 pt-10 hidden lg:block">
             <div className="flex items-center gap-12 pr-4 pb-4">
                <div>
                  <h3 className="text-4xl font-extrabold text-text-primary mb-1">10x</h3>
                  <p className="text-xs text-text-secondary max-w-[120px]">Lebih cepat layani antrean pelanggan</p>
                </div>
                <div>
                  <h3 className="text-4xl font-extrabold text-text-primary mb-1">0</h3>
                  <p className="text-xs text-text-secondary max-w-[120px]">Biaya setup hardware yang rumit</p>
                </div>
                <div>
                  <h3 className="text-4xl font-extrabold text-text-primary mb-1">100%</h3>
                  <p className="text-xs text-text-secondary max-w-[120px]">Akurasi pemrosesan NLP Indonesia</p>
                </div>
             </div>
          </motion.div>
          
        </motion.div>
        
        {/* Mobile Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="lg:hidden bg-background rounded-[2rem] shadow-sm border border-border-soft p-6 mt-6 flex justify-between"
        >
           <div className="text-center">
             <h3 className="text-2xl font-bold text-text-primary">10x</h3>
             <p className="text-[10px] text-text-secondary">Lebih Cepat</p>
           </div>
           <div className="text-center">
             <h3 className="text-2xl font-bold text-text-primary">0</h3>
             <p className="text-[10px] text-text-secondary">Biaya Setup</p>
           </div>
           <div className="text-center">
             <h3 className="text-2xl font-bold text-text-primary">100%</h3>
             <p className="text-[10px] text-text-secondary">Akurasi AI</p>
           </div>
        </motion.div>
      </section>

      {/* Target Audience Section */}
      <section className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center md:text-left md:flex justify-between items-end mb-16">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold text-text-primary max-w-lg leading-tight">
              Fokus pada efisiensi,<br/><span className="text-text-secondary font-medium">kami membantu berbagai jenis usaha</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-secondary max-w-md mt-4 md:mt-0 md:text-right text-sm leading-relaxed hidden md:block">
              Solusi yang dirancang khusus untuk memastikan pelayanan yang cepat, tepat, dan dapat diandalkan bagi UMKM di seluruh Indonesia.
            </motion.p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { icon: 'restaurant', name: 'Restoran & Kafe' },
              { icon: 'storefront', name: 'Retail & Toko' },
              { icon: 'local_shipping', name: 'Distributor' },
              { icon: 'build', name: 'Jasa & Servis' },
              { icon: 'local_cafe', name: 'Kedai Kopi' }
            ].map((item, idx) => (
              <motion.div variants={scaleUp} key={idx} className="flex flex-col items-center gap-4 group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-background border border-border-soft flex items-center justify-center hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                   <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                   <span className="material-symbols-outlined text-4xl md:text-5xl text-text-secondary group-hover:text-primary transition-colors relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
                     {item.icon}
                   </span>
                </div>
                <span className="font-bold text-sm md:text-base text-text-primary group-hover:text-primary transition-colors">{item.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 md:px-12 bg-background relative border-t border-border-soft/50 overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold text-text-primary leading-tight">
              Kualitas terbaik, <span className="text-text-secondary font-medium">dengan<br/>fitur yang memudahkan Anda</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                icon: 'mic',
                title: 'AI Voice Order',
                desc: 'Cukup ucapkan pesanan pelanggan. AI kami akan mengidentifikasi produk, jumlah, dan menghitung total harga dalam hitungan detik. Bebas repot.',
                color: 'text-blue-500',
                bg: 'bg-blue-500/10'
              },
              {
                icon: 'inventory_2',
                title: 'Manajemen Produk Cerdas',
                desc: 'Pantau stok barang, sesuaikan harga, dan atur kategori dengan mudah dalam satu dashboard elegan yang dirancang untuk kecepatan.',
                color: 'text-green-500',
                bg: 'bg-green-500/10'
              },
              {
                icon: 'query_stats',
                title: 'Analisis Penjualan',
                desc: 'Laporan harian komprehensif, tren produk terlaris, dan histori transaksi lengkap untuk membantu Anda mengambil keputusan bisnis yang tepat.',
                color: 'text-purple-500',
                bg: 'bg-purple-500/10'
              },
              {
                icon: 'devices',
                title: 'Akses Multi-Platform',
                desc: 'Gunakan Suara Kasir di perangkat apa pun. Responsif di smartphone, tablet, maupun layar desktop komputer kasir Anda.',
                color: 'text-orange-500',
                bg: 'bg-orange-500/10'
              }
            ].map((feature, idx) => (
              <motion.div variants={fadeUp} key={idx} className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-border-soft hover:shadow-xl hover:-translate-y-2 hover:border-border-default transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About IDCamp Section */}
      <section id="idcamp" className="py-24 px-6 md:px-12 bg-white overflow-hidden relative">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16"
        >
          <div className="flex-1 space-y-8">
            <motion.h2 variants={slideInLeft} className="text-3xl md:text-5xl font-extrabold text-text-primary leading-tight">
              Tantangan nyata UMKM,<br/>
              <span className="text-text-secondary font-medium">terjawab dengan AI</span>
            </motion.h2>
            <motion.div variants={slideInLeft} className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-sidebar text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md">IDCamp Challenge</span>
            </motion.div>
            <motion.p variants={slideInLeft} className="text-lg text-text-secondary leading-relaxed">
              Dari jutaan UMKM di Indonesia, banyak yang masih terjebak pencatatan manual yang lambat. <b>Suara Kasir</b> hadir menjawab tantangan ini: memanfaatkan <i>Generative AI</i> untuk menciptakan solusi kasir digital yang praktis, otomatis, dan tak perlu keahlian teknis sama sekali.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-4 mt-8">
              {[
                'Ucapkan pesanan, AI otomatis mencatatnya', 
                'Kurangi antrean panjang di jam-jam sibuk', 
                'Laporan penjualan rapi tanpa ketik manual'
              ].map((li, i) => (
                <motion.li variants={fadeUp} key={i} className="flex items-center gap-3 text-text-primary font-medium">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  {li}
                </motion.li>
              ))}
            </motion.ul>
          </div>
          
          <motion.div variants={slideInRight} className="flex-1 w-full relative">
            <div className="aspect-square md:aspect-auto md:h-[500px] w-full bg-border-soft rounded-[3rem] overflow-hidden relative shadow-2xl group">
              {/* Actual Image */}
              <img 
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=800" 
                alt="Kasir modern melayani pelanggan" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Floating UI Elements simulating the Voice App */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-6 md:bottom-8 left-6 right-6 md:left-8 md:right-8"
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 md:p-6 rounded-[2rem] shadow-2xl">
                  <div className="flex items-center gap-4 mb-3 md:mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-primary/40 relative">
                      <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-50"></span>
                      <span className="material-symbols-outlined text-white relative z-10">mic</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm md:text-base">AI Voice Processing...</p>
                      <div className="flex items-end gap-1 mt-1.5 h-4">
                        <span className="w-1 h-3 bg-white/80 rounded-full animate-bounce"></span>
                        <span className="w-1 h-full bg-white/80 rounded-full animate-bounce" style={{animationDelay: '100ms'}}></span>
                        <span className="w-1 h-2 bg-white/80 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></span>
                        <span className="w-1 h-full bg-white/80 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                        <span className="w-1 h-3 bg-white/80 rounded-full animate-bounce" style={{animationDelay: '400ms'}}></span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/90 text-sm md:text-base font-medium italic">&quot;Dua es kopi susu gula aren, satu roti bakar cokelat...&quot;</p>
                </div>
              </motion.div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary rounded-full blur-2xl opacity-20" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500 rounded-full blur-2xl opacity-20" />
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Solving / Testimonial */}
      <section className="py-24 px-6 md:px-12 bg-background relative overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16"
        >
          <motion.div variants={slideInLeft} className="flex-1 w-full">
            <div className="w-full h-80 md:h-[400px] bg-card rounded-[3rem] border border-border-soft shadow-lg relative overflow-hidden flex items-center justify-center p-8 text-center group">
               {/* Illustration / Graphic placeholder */}
               <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
               <div className="relative z-10 flex flex-col items-center">
                 <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl text-primary animate-bounce">record_voice_over</span>
                 </div>
                 <h3 className="text-2xl font-bold text-text-primary">&quot;Satu Nasi Goreng Spesial, Dua Es Teh Manis&quot;</h3>
                 <p className="text-text-secondary mt-3 max-w-sm">Tanpa perlu mengetik, sistem otomatis menambahkan ke keranjang dan menghitung total.</p>
               </div>
            </div>
          </motion.div>
          <motion.div variants={slideInRight} className="flex-1 space-y-6 text-center md:text-left mt-8 md:mt-0">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary leading-tight">
              Tinggalkan cara lama,<br/>
              <span className="text-text-secondary font-medium">bantu kasir bekerja lebih cerdas</span>
            </h2>
            <div className="md:pl-6 md:border-l-4 md:border-primary mt-8 py-2 text-left">
              <p className="text-lg md:text-xl text-text-primary font-medium italic">
                &quot;Dulu saat jam sibuk, kedai kami selalu kewalahan karena kasir harus mencatat pesanan manual satu per satu. Dengan Suara Kasir, kasir tinggal menyebutkan pesanan ke tablet. Nota langsung jadi, dan antrean panjang teratasi!&quot;
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-sidebar rounded-full flex items-center justify-center text-white font-bold">FA</div>
                <div className="text-sm">
                  <p className="font-bold text-text-primary text-base">Fahri Ahmad</p>
                  <p className="text-text-secondary">Pemilik Kedai Kopi (UMKM)</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar pt-20 pb-10 px-6 md:px-12 text-white overflow-hidden relative">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-white/10 pb-16">
            <motion.div variants={fadeUp} className="max-w-md space-y-6 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Saatnya beralih ke sistem kasir pintar, dengan sumber daya AI.
              </h2>
              <div className="flex gap-4 items-center text-sm font-medium text-white/60">
                <span className="flex items-center gap-1.5 text-green-400"><span className="material-symbols-outlined text-lg">check_circle</span> Efisien & Cepat</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">support_agent</span> Teknologi Terdepan</span>
              </div>
            </motion.div>
            
            <motion.div variants={fadeUp} className="relative z-10">
              <Link href="/login" className="inline-flex px-8 py-4 bg-white text-sidebar rounded-full font-bold text-sm hover:bg-border-soft hover:scale-105 transition-all">
                Coba Gratis Sekarang <span className="material-symbols-outlined ml-2 text-lg">arrow_outward</span>
              </Link>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[18px]">bolt</span>
              </div>
              <span className="text-lg font-bold tracking-tight">Suara Kasir</span>
            </div>

            <div className="flex gap-6 text-sm font-medium text-white/50">
              <button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">Beranda</button>
              <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Fitur</button>
              <button onClick={() => scrollToSection('idcamp')} className="hover:text-white transition-colors">Tentang Proyek</button>
            </div>

            <div className="text-sm text-white/30">
              &copy; 2024 Suara Kasir. Hak Cipta Dilindungi.
            </div>
          </motion.div>
        </motion.div>

        {/* Footer decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      </footer>
    </div>
  );
}
