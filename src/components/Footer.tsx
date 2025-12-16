import {
IconBrandInstagram,
IconBrandX,
IconBrandMeta
} from "@tabler/icons-react";



export default function Footer() {
  return (
    <footer className="bg-black pt-24 pb-12 border-t border-white/5">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-1">
            <a href="#" className="text-2xl tracking-[0.2em] font-light text-white uppercase block mb-8">
              Preety Twist
            </a>
            <p className="text-neutral-600 text-sm font-light leading-relaxed">
              Redefining the art of hair accessories through uncompromising quality and modern design.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-8">Shop</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-neutral-500 hover:text-white transition-colors text-sm font-light tracking-wide">All Accessories</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-white transition-colors text-sm font-light tracking-wide">New Arrivals</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-white transition-colors text-sm font-light tracking-wide">The Velvet Edit</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-white transition-colors text-sm font-light tracking-wide">Gift Cards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-8">Client Services</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-neutral-500 hover:text-white transition-colors text-sm font-light tracking-wide">Contact Us</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-white transition-colors text-sm font-light tracking-wide">Shipping & Returns</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-white transition-colors text-sm font-light tracking-wide">Care Instructions</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-white transition-colors text-sm font-light tracking-wide">FAQ</a></li>
            </ul>
          </div>

          {/* <div>
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-8">Newsletter</h4>
            <div className="relative border-b border-neutral-800 hover:border-white transition-colors duration-300 pb-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-transparent w-full text-white outline-none placeholder-neutral-700 font-light text-sm"
              />
              <button className="absolute right-0 bottom-2 text-neutral-500 hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div> */}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
          <div className="flex gap-6 mb-4 md:mb-0">
            <span className="text-neutral-700 text-xs">© 2025 Pretty Twist</span>
            <a href="#" className="text-neutral-700 hover:text-neutral-400 text-xs transition-colors">Privacy</a>
            <a href="#" className="text-neutral-700 hover:text-neutral-400 text-xs transition-colors">Terms</a>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-neutral-500 hover:text-white transition-colors">
              <IconBrandInstagram className="w-4 h-4" />
            </a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors">
              <IconBrandX className="w-4 h-4" />
            </a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors">
              <IconBrandMeta className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};