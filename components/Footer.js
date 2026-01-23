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
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/MyOrder">My Order</Link>
            </li>
            <li>
              <Link href="/MyHistory">My History</Link>
            </li>
            <li>
              <Link href="/Faq">FAQ</Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-4">Policy</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/termsConditions">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/privacypolicy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/shippingInfo">Shipping Information</Link>
            </li>
            <li>
              <Link href="/Returnsexchange">Returns & Exchanges</Link>
            </li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="text-white font-semibold mb-4">About</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/aboutus">About Us</Link>
            </li>
            <li>
              <Link href="/Contactus">Contact us</Link>
            </li>
            <li>
              <Link href="/Sustainability">Sustainability</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-700 flex gap-1 items-center justify-center py-4 text-sm text-gray-200">
        <Link href="/termsConditions">Terms & Conditions |</Link>

        <Link href="/privacypolicy">Privacy Policy |</Link>
        <Link href="/Returnsexchange">Returns & Exchanges</Link>
      </div>
    </footer>
  );
};

export default Footer;
