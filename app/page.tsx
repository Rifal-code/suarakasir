"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, getPublicFeedbacks, getFeedbackDetail } from "@/lib/api";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Logo from "@/components/shared/Logo";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMoreFeedbacks, setHasMoreFeedbacks] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const LIMIT = 6;
  
  // Parallax for Hero
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const yBg = useTransform(heroScroll, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    // Check if already logged in to update buttons
    if (getAuthToken()) {
      setIsLoggedIn(true);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch initial feedbacks
    const fetchFeedbacks = async () => {
      try {
        setIsLoadingFeedbacks(true);
        const { response, data } = await getPublicFeedbacks(1, LIMIT);
        if (response.ok && data.success && Array.isArray(data.data)) {
          setFeedbacks(data.data);
          setHasMoreFeedbacks(data.data.length === LIMIT && data.total > LIMIT);
          setPage(2);
        }
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
      } finally {
        setIsLoadingFeedbacks(false);
      }
    };
    fetchFeedbacks();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

  const loadMoreFeedbacks = async () => {
    if (isFetchingMore || !hasMoreFeedbacks) return;
    try {
      setIsFetchingMore(true);
      const { response, data } = await getPublicFeedbacks(page, LIMIT);
      if (response.ok && data.success && Array.isArray(data.data)) {
        setFeedbacks(prev => [...prev, ...data.data]);
        setHasMoreFeedbacks(feedbacks.length + data.data.length < data.total);
        setPage(p => p + 1);
      }
    } catch (error) {
      console.error("Failed to load more feedbacks:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleFeedbackClick = async (feedback: any) => {
    // Tampilkan modal skeleton dulu
    setSelectedFeedback({ id: feedback.id, isLoading: true });
    setIsLoadingDetail(true);
    try {
      const { response, data } = await getFeedbackDetail(feedback.id);
      if (response.ok && data.success) {
        setSelectedFeedback(data.data);
      } else {
        // Fallback to basic info if API fails
        setSelectedFeedback(feedback);
      }
    } catch (error) {
      console.error("Failed to fetch feedback detail:", error);
      setSelectedFeedback(feedback);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-text-primary selection:bg-primary/20 selection:text-primary overflow-x-hidden font-sans">
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10 drop-shadow-md" />
            <span className="text-xl font-bold tracking-tight">Suara Kasir</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button onClick={() => scrollToSection('home')} className="text-text-secondary hover:text-primary transition-colors">Beranda</button>
            <button onClick={() => scrollToSection('features')} className="text-text-secondary hover:text-primary transition-colors">Fitur</button>
            <button onClick={() => scrollToSection('idcamp')} className="text-text-secondary hover:text-primary transition-colors">Tentang Proyek</button>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block px-5 py-2.5 text-sm font-bold text-text-primary hover:text-primary transition-colors">
                  Masuk
                </Link>
                <Link href="/register" className="hidden sm:inline-flex px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                  Coba Gratis
                </Link>
                <Link href="/login" className="sm:hidden px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                  Masuk
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section Redesign */}
      <section id="home" ref={heroRef} className="pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto relative">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="relative w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-sidebar flex flex-col justify-center min-h-[550px] md:min-h-[700px] group"
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
              {isLoggedIn ? (
                <Link href="/dashboard" className="flex items-center gap-2 text-white font-bold text-lg hover:text-primary transition-colors group/link">
                  Buka Dashboard
                  <span className="material-symbols-outlined text-sm group-hover/link:-translate-y-1 group-hover/link:translate-x-1 transition-transform">arrow_outward</span>
                </Link>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-white font-bold text-lg hover:text-primary transition-colors group/link">
                  Coba Gratis Sekarang
                  <span className="material-symbols-outlined text-sm group-hover/link:-translate-y-1 group-hover/link:translate-x-1 transition-transform">arrow_outward</span>
                </Link>
              )}
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
          <motion.div variants={fadeUp} className="absolute bottom-0 right-0 bg-white rounded-tl-[3rem] pl-10 pt-10 hidden lg:block">
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
          className="lg:hidden bg-white rounded-[2rem] shadow-sm border border-border-soft p-6 mt-6 flex justify-between"
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
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-1/4 opacity-20 hidden md:block"
          >
            <span className="material-symbols-outlined text-6xl text-primary">store</span>
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 left-1/4 opacity-20 hidden md:block"
          >
            <span className="material-symbols-outlined text-6xl text-blue-400">payments</span>
          </motion.div>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto relative z-10"
        >
          <div className="text-center md:text-left md:flex justify-between items-end mb-16 relative">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold text-text-primary max-w-xl leading-tight">
              Fokus pada efisiensi,<br/><span className="text-text-secondary font-medium">kami membantu berbagai jenis usaha</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-text-secondary max-w-lg mt-6 md:mt-0 md:text-right text-base md:text-lg leading-relaxed hidden md:block font-medium">
              Solusi yang dirancang khusus untuk memastikan pelayanan yang cepat, tepat, dan dapat diandalkan bagi UMKM di seluruh Indonesia.
            </motion.p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { icon: 'restaurant', name: 'Restoran & Kafe', color: 'group-hover:text-orange-500', bg: 'group-hover:bg-orange-50' },
              { icon: 'storefront', name: 'Retail & Toko', color: 'group-hover:text-blue-500', bg: 'group-hover:bg-blue-50' },
              { icon: 'local_shipping', name: 'Distributor', color: 'group-hover:text-green-500', bg: 'group-hover:bg-green-50' },
              { icon: 'build', name: 'Jasa & Servis', color: 'group-hover:text-purple-500', bg: 'group-hover:bg-purple-50' },
              { icon: 'local_cafe', name: 'Kedai Kopi', color: 'group-hover:text-amber-700', bg: 'group-hover:bg-amber-50' }
            ].map((item, idx) => (
              <motion.div variants={scaleUp} key={idx} className="flex flex-col items-center gap-4 group cursor-pointer">
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-background border border-border-soft flex items-center justify-center hover:shadow-2xl transition-all duration-300 relative overflow-hidden transform group-hover:-translate-y-2 group-hover:scale-105 ${item.bg}`}>
                   <span className={`material-symbols-outlined text-4xl md:text-5xl text-text-secondary transition-colors relative z-10 ${item.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                     {item.icon}
                   </span>
                </div>
                <span className="font-bold text-sm md:text-lg text-text-primary group-hover:text-primary transition-colors">{item.name}</span>
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

      {/* Feedback / Testimonial */}
      <section className="py-24 px-6 md:px-12 bg-background relative overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold text-text-primary leading-tight">
              Tinggalkan cara lama,<br/>
              <span className="text-text-secondary font-medium">bantu kasir bekerja lebih cerdas</span>
            </motion.h2>
          </div>

          {isLoadingFeedbacks ? (
            <div className="flex justify-center items-center py-12">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
            </div>
          ) : feedbacks.length > 0 ? (
            <motion.div 
              initial="hidden"
              animate="show"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {feedbacks.map((item, idx) => (
                <motion.div 
                  variants={fadeUp} 
                  key={item.id || idx} 
                  onClick={() => handleFeedbackClick(item)}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-border-soft hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between cursor-pointer group"
                >
                  <div className="mb-6">
                    <span className="material-symbols-outlined text-primary/30 text-5xl mb-4 group-hover:text-primary/50 transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                    <p className="text-text-primary text-lg italic leading-relaxed line-clamp-4">
                      &quot;{item.message}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-border-soft mt-auto">
                    <div className="w-12 h-12 bg-sidebar rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      {(item.user_name || item.name || "A")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-text-primary text-base">{item.user_name || item.name || "Pengguna Suara Kasir"}</p>
                      <p className="text-sm text-text-secondary line-clamp-1">{item.user_description || item.description || "Pemilik UMKM"}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center text-text-secondary py-12">
              Belum ada masukan publik. Jadilah yang pertama!
            </div>
          )}

          {hasMoreFeedbacks && feedbacks.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 flex justify-center"
            >
              <button 
                onClick={loadMoreFeedbacks}
                disabled={isFetchingMore}
                className="px-8 py-3 bg-white border border-border-default text-text-primary rounded-full font-bold hover:bg-gray-50 hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isFetchingMore ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Memuat...
                  </>
                ) : (
                  <>
                    Muat Lebih Banyak
                    <span className="material-symbols-outlined text-sm">expand_more</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
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
              {isLoggedIn ? (
                <Link href="/dashboard" className="inline-flex px-8 py-4 bg-white text-sidebar rounded-full font-bold text-sm hover:bg-border-soft hover:scale-105 transition-all">
                  Buka Dashboard <span className="material-symbols-outlined ml-2 text-lg">arrow_outward</span>
                </Link>
              ) : (
                <Link href="/login" className="inline-flex px-8 py-4 bg-white text-sidebar rounded-full font-bold text-sm hover:bg-border-soft hover:scale-105 transition-all">
                  Coba Gratis Sekarang <span className="material-symbols-outlined ml-2 text-lg">arrow_outward</span>
                </Link>
              )}
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8 drop-shadow-sm" />
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

      {/* Feedback Modal Overlay */}
      <AnimatePresence>
        {selectedFeedback && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeedback(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full sm:max-w-2xl"
            >
              {/* Desktop Close Button (Outside Card) */}
              <button 
                onClick={() => setSelectedFeedback(null)}
                className="hidden sm:flex absolute -top-12 right-0 xl:-right-12 w-10 h-10 bg-white/15 hover:bg-white/25 rounded-full items-center justify-center text-white transition-colors z-50 backdrop-blur-md"
                aria-label="Tutup"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>

              <div className="bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] sm:max-h-[90vh] flex flex-col w-full">
                <div className="bg-sidebar p-6 sm:p-8 md:p-10 pb-14 sm:pb-16 relative shrink-0">
                  {/* Mobile Slide Indicator */}
                  <div className="sm:hidden absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full"></div>

                  <span className="material-symbols-outlined text-white/10 text-6xl sm:text-8xl absolute top-8 left-6 sm:top-6" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                  
                  {isLoadingDetail ? (
                    <div className="animate-pulse space-y-4 relative z-10 pt-4">
                      <div className="h-4 bg-white/20 rounded w-3/4"></div>
                      <div className="h-4 bg-white/20 rounded w-full"></div>
                      <div className="h-4 bg-white/20 rounded w-5/6"></div>
                    </div>
                  ) : (
                    <p className="text-white text-lg sm:text-xl md:text-2xl leading-relaxed italic relative z-10 pt-8 sm:pt-4 max-h-[35vh] sm:max-h-[40vh] overflow-y-auto pr-2 modal-scrollbar">
                      &quot;{selectedFeedback.message}&quot;
                    </p>
                  )}
                </div>
                
                <div className="bg-white p-5 sm:p-8 md:p-10 -mt-8 relative z-20 rounded-t-[2rem]">
                  {isLoadingDetail ? (
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full animate-pulse border-4 border-white shadow-lg"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shrink-0 shadow-lg border-4 border-white">
                        {(selectedFeedback.user_name || selectedFeedback.name || "A")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-primary text-base sm:text-xl truncate">{selectedFeedback.user_name || selectedFeedback.name || "Pengguna Suara Kasir"}</p>
                        <p className="text-text-secondary text-xs sm:text-sm font-medium">{selectedFeedback.user_description || selectedFeedback.description || "Pemilik UMKM"}</p>
                      </div>
                      {selectedFeedback.created_at && (
                        <div className="text-[11px] sm:text-xs text-text-secondary font-medium px-2.5 py-1 sm:px-3 sm:py-1.5 bg-background rounded-full border border-border-soft shrink-0">
                          {new Date(selectedFeedback.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
