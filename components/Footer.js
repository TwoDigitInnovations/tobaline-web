"use client";

import React from "react";
import Link from "next/link";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#1c1c1c] to-[#121212] text-gray-300">
      {/* Top Content */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-700">

        <div>
          <h3 className="text-white font-semibold mb-4">Customer Care</h3>
          <p className="text-sm leading-relaxed mb-4">
            Need help? Email us at <br />
            <span className="text-white">contact@bachhoahouston.com</span>
            <br />
            We’re here for you, and ready to answer your questions.
          </p>
          <p className="text-sm mb-4">24/7 Availability</p>

          <div className="flex gap-4">
            <a className="hover:text-white" href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a className="hover:text-white" href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
          </div>
        </div>

        {/* Customer Care Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Customer Care</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#">Size Guide</Link></li>
            <li><Link href="#">Shipping Information</Link></li>
            <li><Link href="#">Returns & Exchanges</Link></li>
            <li><Link href="#">FAQ</Link></li>
            <li><Link href="#">Wholesale</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#">We’re Hiring</Link></li>
            <li><Link href="/termsConditions">Terms & Conditions</Link></li>
            <li><Link href="/privacypolicy">Privacy Policy</Link></li>

          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="text-white font-semibold mb-4">About</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/aboutus">About Us</Link></li>
            <li><Link href="/Contactus">Contact us</Link></li>
            <li><Link href="#">Collaborations</Link></li>
            <li><Link href="#">Charities</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-700 text-center py-4 text-sm text-gray-200">
        <p>
          Terms of Service &nbsp;|&nbsp; Privacy Policy &nbsp;|&nbsp; Accessibility
        </p>
      </div>
    </footer>
  );
};

export default Footer;
