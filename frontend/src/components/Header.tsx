import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <header className="bg-white p-4 shadow font-raleway">
        <nav className="container mx-auto flex justify-between items-center">
          <ul className="flex space-x-8">
            <li>
              <a
                href="#women"
                className="text-green-500 font-bold"
                data-testid="category-link"
              >
                WOMEN
              </a>
            </li>
            <li>
              <a
                href="#men"
                className="text-black font-bold"
                data-testid="category-link"
              >
                MEN
              </a>
            </li>
            <li>
              <a
                href="#kids"
                className="text-black font-bold"
                data-testid="category-link"
              >
                KIDS
              </a>
            </li>
          </ul>
          <button data-testid="cart-btn" className="relative">
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-3.9-7H4m0 0l-1.1-2m5 2L7 13m0 0l1.4-7H20m-1.4 7h.6l1.1 2M4 7H2.4l1.1-2m17.5 11.2a1 1 0 01-.8.8H6.3a1 1 0 01-.8-.8L4 13h16l-1.6 3.2z"
              ></path>
            </svg>
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
              0
            </span>
          </button>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-3.9-7H4m0 0l-1.1-2m5 2L7 13m0 0l1.4-7H20m-1.4 7h.6l1.1 2M4 7H2.4l1.1-2m17.5 11.2a1 1 0 01-.8.8H6.3a1 1 0 01-.8-.8L4 13h16l-1.6 3.2z"
            ></path>
          </svg>
        </nav>
      </header>
    );
  }
}

export default Header;
