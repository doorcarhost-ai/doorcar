import Link from "next/link";
import { Car } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const links = {
  Product: ["Explore Cars", "How It Works", "Pricing", "Host Your Car"],
  Company: ["About Us", "Careers", "Press", "Blog"],
  Support: ["Help Center", "Safety", "Cancellation", "Contact"],
  Legal: ["Privacy Policy", "Terms", "Cookies", "Accessibility"],
};

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF7A00]">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#111827]">
                Ride<span className="text-[#FF7A00]">Host</span>
              </span>
            </Link>
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs">
              India&apos;s premium self-drive car rental platform. Drive the freedom you deserve, anytime anywhere.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {["App Store", "Google Play"].map((store) => (
                <div key={store} className="px-4 py-2 bg-[#111827] text-white text-xs font-semibold rounded-xl cursor-pointer hover:bg-gray-800 transition-colors">
                  {store}
                </div>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-[#111827] mb-4 text-sm">{category}</h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-[#6B7280] hover:text-[#FF7A00] transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#6B7280]">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="text-xs text-[#6B7280]">Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
