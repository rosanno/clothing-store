import React, { useState, useEffect, useContext, useRef } from "react";
import { BsHandbag } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMenuAltRight } from "react-icons/bi";
import { FiShoppingBag } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { HiOutlineLogout } from "react-icons/hi";
import { BiUser } from "react-icons/bi";
import { Avatar } from "../avatar/Avatar";
import { CartContext } from "../../context/CartContext";

const Items = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Shop",
    path: "/Shop",
  },
  {
    name: "Women",
    path: "/Shop",
    query: "women",
  },
  {
    name: "Men",
    path: "/Shop",
    query: "men",
  },
];

interface Sessions {}

const NavItems = ({
  name,
  path,
  router,
  query,
}: {
  name: string;
  path: string;
  router: any;
  query: string;
}) => (
  <li className="listItem">
    {query ? (
      <Link
        href={{
          pathname: path,
          query: { category: query },
        }}
        className={`${
          router.query.category === query && "text-[#26C79E]"
        } hover:text-[#26C79E] transition-all duration-200`}
      >
        {name}
      </Link>
    ) : (
      <Link
        href={path}
        className={`${
          router.pathname === path && !router.query.category && "text-[#26C79E]"
        } hover:text-[#26C79E] transition-all duration-200`}
      >
        {name}
      </Link>
    )}
  </li>
);

const Navbar = () => {
  const router = useRouter();
  const outSideRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const { data: sessions, status }: any = useSession();
  const { cartCount, getItems } = useContext(CartContext);

  const handleClickOutside = (event) => {
    if (outSideRef.current && !outSideRef.current.contains(event.target)) {
      setDropDownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (sessions) {
      getItems();
    }
  }, [sessions]);

  return (
    <div ref={outSideRef} className="w-full">
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 w-full md:max-w-[1240px] mx-auto">
          <div>
            <h2 className="font-dancingscript font-bold text-2xl md:text-3xl">
              <Link href="/">Clothing</Link>
            </h2>
          </div>
          <div>
            <ul className="hidden md:flex items-center space-x-10 font-semibold">
              {Items.map(({ name, path, query }) => (
                <NavItems
                  key={name}
                  name={name}
                  path={path}
                  router={router}
                  query={query}
                />
              ))}
            </ul>
          </div>
          <div className="flex items-center space-x-3">
            {status !== "authenticated" ? (
              <ul className="hidden md:flex items-center gap-4">
                <li className="listItem">
                  <Link
                    href="/login"
                    className="hover:text-[#26C79E] transition-all duration-200"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            ) : (
              <div className="relative flex items-center justify-end gap-3">
                <span className="text-sm font-poppins hidden md:block">
                  {sessions.user.name}
                </span>
                <div className="relative">
                  <div>
                    <Avatar
                      imageUrl={sessions.user.image}
                      setDropDownOpen={setDropDownOpen}
                    />
                  </div>
                  <ul
                    className={`absolute right-0 top-10 z-10 w-[200px] rounded-md shadow-lg bg-white overflow-hidden ${
                      dropDownOpen
                        ? "transition ease-in-out duration-100 transform opacity-1 scale-100"
                        : "transition ease-in-out duration-100 transform opacity-0 scale-0"
                    } transition-all duration-500`}
                  >
                    <li onClick={() => setDropDownOpen(false)}>
                      <Link
                        href={`/account/${sessions.user.id}`}
                        className="font-poppins font-medium text-sm flex items-center gap-3 cursor-pointer hover:bg-gray-500/10 px-4 py-3 transition-all duration-300"
                      >
                        <BiUser size={20} /> <span>Account</span>
                      </Link>
                    </li>
                    <li onClick={() => setDropDownOpen(false)}>
                      <Link
                        href="/favorite"
                        className="font-poppins font-medium text-sm flex items-center gap-3 cursor-pointer hover:bg-gray-500/10 px-4 py-3 transition-all duration-300"
                      >
                        <AiOutlineHeart size={20} /> <span>Favorite</span>
                      </Link>
                    </li>
                    <li onClick={() => setDropDownOpen(false)}>
                      <Link
                        href="/order"
                        className="font-poppins font-medium text-sm flex items-center gap-3 cursor-pointer hover:bg-gray-500/10 px-4 py-3 transition-all duration-300"
                      >
                        <FiShoppingBag size={20} /> <span>Orders</span>
                      </Link>
                    </li>
                    <li
                      onClick={() => signOut({ callbackUrl: router.asPath })}
                      className="font-poppins font-medium text-sm flex items-center gap-3 cursor-pointer hover:bg-gray-500/10 px-4 py-3 transition-all duration-300"
                    >
                      <HiOutlineLogout size={20} /> <span>Sign Out</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            <div className="text-gray-500 hidden md:block border-r-2 h-5 border-gray-600"></div>
            <div className="relative">
              <Link href="/cart" className="icons block">
                <BsHandbag size={20} />
              </Link>
              <div
                className={`absolute -top-3 -right-2 w-5 h-5 ${
                  cartCount.length !== 0
                    ? "transition ease-in-out duration-300 transform opacity-1 scale-100"
                    : "transition ease-in-out duration-200 transform opacity-0 scale-0"
                }  bg-red-600 rounded-full flex justify-center items-center overflow-hidden`}
              >
                <span className="text-xs text-white font-poppins font-medium">
                  {cartCount?.length}
                </span>
              </div>
            </div>
            <div
              className="icons inline-block md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <BiMenuAltRight size={25} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`flex flex-col items-center z-20 md:hidden fixed inset-y-0 right-0 bg-gradient-to-t from-[#2C3E50]/90 to-[#000000]/90 w-[280px] ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-all duration-500`}
      >
        <div
          className="text-white absolute left-2 top-3 icons"
          onClick={() => setIsSidebarOpen(false)}
        >
          <IoClose size={25} />
        </div>
        <ul className="mt-28">
          {Items.map(({ name, path, query }) => (
            <div key={name} onClick={() => setIsSidebarOpen(false)}>
              <NavItems name={name} path={path} router={router} query={query} />
            </div>
          ))}
        </ul>
      </div>

      {isSidebarOpen && (
        <div
          className="absolute top-0 block md:hidden z-10 w-full h-screen overflow-hidden bg-black/70 transition-all duration-500"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
