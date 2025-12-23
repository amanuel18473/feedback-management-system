// "use client";

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { FileIcon, UserIcon } from "@/icons";
// import {
//   BoxCubeIcon,
//   CalenderIcon,
//   ChevronDownIcon,
//   GridIcon,
//   HorizontaLDots,
//   ListIcon,
//   PageIcon,
//   PieChartIcon,
//   PlugInIcon,
//   TableIcon,
//   UserCircleIcon,
// } from "../icons/index";
// import SidebarWidget from "./SidebarWidget";
// import { useSidebar } from "../context/SidebarContext";
// import "./sidebar.css";

// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// };

// const ADMIN_BASE = "/admin";

// // Nav items
// const navItems: NavItem[] = [
//   { icon: <GridIcon />, name: "Dashboard", subItems: [{ name: "Feedback Management", path: `${ADMIN_BASE}` }] },
//   { icon: <CalenderIcon />, name: "Calendar", path: `${ADMIN_BASE}/calendar` },
//   { icon: <CalenderIcon />, name: "Branch", subItems: [{ name: "List", path: `${ADMIN_BASE}/branch/list` }, { name: "Add / Edit", path: `${ADMIN_BASE}/branch/add` }] },
//   { icon: <UserIcon />, name: "QR Code", subItems: [{ name: "List", path: `${ADMIN_BASE}/qrcode/list` }, { name: "Add / Edit", path: `${ADMIN_BASE}/qrcode/add` }] },
//   { icon: <UserIcon />, name: "Users", subItems: [{ name: "List", path: `${ADMIN_BASE}/users/list` }, { name: "Add / Edit", path: `${ADMIN_BASE}/users/add` }] },
//   { icon: <FileIcon />, name: "Announcement", subItems: [{ name: "List", path: `${ADMIN_BASE}/announcement/list` }, { name: "Add / Edit", path: `${ADMIN_BASE}/announcement/add` }] },
//   { icon: <CalenderIcon />, name: "Feedback", path: `${ADMIN_BASE}/feedback/list` },
//   { icon: <UserCircleIcon />, name: "User Profile", path: `${ADMIN_BASE}/profile` },
//   { name: "Forms", icon: <ListIcon />, subItems: [{ name: "Form Elements", path: `${ADMIN_BASE}/form-elements`, pro: false }] },
//   { name: "Tables", icon: <TableIcon />, subItems: [{ name: "Basic Tables", path: `${ADMIN_BASE}/tables/basic`, pro: false }] },
//   { name: "Pages", icon: <PageIcon />, subItems: [{ name: "Blank Page", path: `${ADMIN_BASE}/blank`, pro: false }, { name: "404 Error", path: `${ADMIN_BASE}/error-404`, pro: false }] },
// ];

// const othersItems: NavItem[] = [
//   { icon: <PieChartIcon />, name: "Charts", subItems: [{ name: "Line Chart", path: `${ADMIN_BASE}/charts/line`, pro: false }, { name: "Bar Chart", path: `${ADMIN_BASE}/charts/bar`, pro: false }] },
//   { icon: <BoxCubeIcon />, name: "UI Elements", subItems: [{ name: "Alerts", path: `${ADMIN_BASE}/ui/alerts`, pro: false }, { name: "Avatar", path: `${ADMIN_BASE}/ui/avatar`, pro: false }, { name: "Badge", path: `${ADMIN_BASE}/ui/badge`, pro: false }, { name: "Buttons", path: `${ADMIN_BASE}/ui/buttons`, pro: false }, { name: "Images", path: `${ADMIN_BASE}/ui/images`, pro: false }, { name: "Videos", path: `${ADMIN_BASE}/ui/videos`, pro: false }] },
//   { icon: <PlugInIcon />, name: "Authentication", subItems: [{ name: "Sign In", path: `/signin`, pro: false }, { name: "Sign Up", path: `/signup`, pro: false }] },
// ];

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const pathname = usePathname();
//   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
//   const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});

//   const isActive = useCallback((path: string) => path === pathname, [pathname]);

//   useEffect(() => {
//     let submenuMatched = false;
//     ["main", "others"].forEach((menuType) => {
//       const items = menuType === "main" ? navItems : othersItems;
//       items.forEach((nav, index) => {
//         if (nav.subItems) {
//           nav.subItems.forEach((subItem) => {
//             if (isActive(subItem.path)) {
//               setOpenSubmenu({ type: menuType as "main" | "others", index });
//               submenuMatched = true;
//             }
//           });
//         }
//       });
//     });
//     if (!submenuMatched) setOpenSubmenu(null);
//   }, [pathname, isActive]);

//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const key = `${openSubmenu.type}-${openSubmenu.index}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prev) => ({ ...prev, [key]: subMenuRefs.current[key]?.scrollHeight || 0 }));
//       }
//     }
//   }, [openSubmenu]);

//   const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
//     setOpenSubmenu((prev) => (prev?.type === menuType && prev.index === index ? null : { type: menuType, index }));
//   };

//   const renderMenuItems = (navItems: NavItem[], menuType: "main" | "others") => (
//     <ul className="flex flex-col gap-2">
//       {navItems.map((nav, index) => (
//         <li key={nav.name}>
//           {nav.subItems ? (
//             <button
//               onClick={() => handleSubmenuToggle(index, menuType)}
//               className={`menu-item group dark:text-gray-200 ${
//                 openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"
//               } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
//             >
//               <span className={`${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
//                 {nav.icon}
//               </span>
//               {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <ChevronDownIcon
//                   className={`ml-auto w-5 h-5 transition-transform duration-200 ${
//                     openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
//                   }`}
//                 />
//               )}
//             </button>
//           ) : (
//             nav.path && (
//               <Link href={nav.path} className={`menu-item group dark:text-gray-200 ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
//                 <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>{nav.icon}</span>
//                 {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
//               </Link>
//             )
//           )}
//           {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
//             <div
//               ref={(el) => {
//                 subMenuRefs.current[`${menuType}-${index}`] = el;
//               }}
//               className="overflow-hidden transition-all duration-300"
//               style={{ height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}
//             >
//               <ul className="mt-2 space-y-1 ml-6">
//                 {nav.subItems.map((subItem) => (
//                   <li key={subItem.name}>
//                     <Link
//                       href={subItem.path}
//                       className={`menu-dropdown-item dark:text-gray-200 ${
//                         isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
//                       }`}
//                     >
//                       {subItem.name}
//                       <span className="flex items-center gap-1 ml-auto">
//                         {subItem.new && <span className="menu-dropdown-badge">new</span>}
//                         {subItem.pro && <span className="menu-dropdown-badge">pro</span>}
//                       </span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-gray-200 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${
//         isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"
//       } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
//         <Link href="/">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <Image className="dark:hidden" src="/images/logo/feedback.png" alt="Logo" width={40} height={40} />
//               <Image className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} />
//             </>
//           ) : (
//             <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
//           )}
//         </Link>
//       </div>

//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 dark:text-gray-500 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
//                 {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
//               </h2>
//               {renderMenuItems(navItems, "main")}
//             </div>
//             <div>
//               <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 dark:text-gray-500 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
//                 {isExpanded || isHovered || isMobileOpen ? "Others" : <HorizontaLDots />}
//               </h2>
//               {renderMenuItems(othersItems, "others")}
//             </div>
//           </div>
//         </nav>
//         {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FileIcon, UserIcon } from "@/icons";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const ADMIN_BASE = "/admin";

// Nav items
const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", subItems: [{ name: "Feedback Management", path: `${ADMIN_BASE}` }] },
  { icon: <CalenderIcon />, name: "Calendar", path: `${ADMIN_BASE}/calendar` },
  { icon: <CalenderIcon />, name: "Branch", subItems: [{ name: "List", path: `${ADMIN_BASE}/branch/list` }, { name: "Add / Edit", path: `${ADMIN_BASE}/branch/add` }] },
  { icon: <UserIcon />, name: "QR Code", subItems: [{ name: "List", path: `${ADMIN_BASE}/qrcode/list` }, { name: "Add / Edit", path: `${ADMIN_BASE}/qrcode/add` }] },
  { icon: <UserIcon />, name: "Users", subItems: [{ name: "List", path: `${ADMIN_BASE}/users/list` }, { name: "Add / Edit", path: `${ADMIN_BASE}/users/add` }] },
  { icon: <FileIcon />, name: "Announcement", subItems: [{ name: "List", path: `${ADMIN_BASE}/announcement/list` }, { name: "Add / Edit", path: `${ADMIN_BASE}/announcement/add` }] },
  { icon: <CalenderIcon />, name: "Feedback", path: `${ADMIN_BASE}/feedback/list` },
  { icon: <UserCircleIcon />, name: "User Profile", path: `${ADMIN_BASE}/profile` },
  { name: "Forms", icon: <ListIcon />, subItems: [{ name: "Form Elements", path: `${ADMIN_BASE}/form-elements`, pro: false }] },
  { name: "Tables", icon: <TableIcon />, subItems: [{ name: "Basic Tables", path: `${ADMIN_BASE}/tables/basic`, pro: false }] },
  { name: "Pages", icon: <PageIcon />, subItems: [{ name: "Blank Page", path: `${ADMIN_BASE}/blank`, pro: false }, { name: "404 Error", path: `${ADMIN_BASE}/error-404`, pro: false }] },
];

const othersItems: NavItem[] = [
  { icon: <PieChartIcon />, name: "Charts", subItems: [{ name: "Line Chart", path: `${ADMIN_BASE}/charts/line`, pro: false }, { name: "Bar Chart", path: `${ADMIN_BASE}/charts/bar`, pro: false }] },
  { icon: <BoxCubeIcon />, name: "UI Elements", subItems: [{ name: "Alerts", path: `${ADMIN_BASE}/ui/alerts`, pro: false }, { name: "Avatar", path: `${ADMIN_BASE}/ui/avatar`, pro: false }, { name: "Badge", path: `${ADMIN_BASE}/ui/badge`, pro: false }, { name: "Buttons", path: `${ADMIN_BASE}/ui/buttons`, pro: false }, { name: "Images", path: `${ADMIN_BASE}/ui/images`, pro: false }, { name: "Videos", path: `${ADMIN_BASE}/ui/videos`, pro: false }] },
  { icon: <PlugInIcon />, name: "Authentication", subItems: [{ name: "Sign In", path: `/signin`, pro: false }, { name: "Sign Up", path: `/signup`, pro: false }] },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({ ...prev, [key]: subMenuRefs.current[key]?.scrollHeight || 0 }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => (prev?.type === menuType && prev.index === index ? null : { type: menuType, index }));
  };

  const renderMenuItems = (navItems: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group dark:text-gray-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"} cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className={`${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
            </button>
          ) : (
            nav.path && (
              <Link href={nav.path} className={`menu-item group dark:text-gray-200 ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{ height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}
            >
              <ul className="mt-2 space-y-1 ml-6">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item dark:text-gray-200 ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <aside
        className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-gray-200 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${
          isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
          <Link href="/">
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                <Image className="dark:hidden" src="/images/logo/feedback.png" alt="Logo" width={40} height={40} />
                <Image className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} />
              </>
            ) : (
              <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
            )}
          </Link>
        </div>

        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 dark:text-gray-500 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                  {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
                </h2>
                {renderMenuItems(navItems, "main")}
              </div>
              <div>
                <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 dark:text-gray-500 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                  {isExpanded || isHovered || isMobileOpen ? "Others" : <HorizontaLDots />}
                </h2>
                {renderMenuItems(othersItems, "others")}
              </div>
            </div>
          </nav>
          {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
        </div>
      </aside>

      {/* Inline Tailwind CSS for sidebar */}
      <style jsx>{`
        .menu-item {
          @apply flex items-center w-full rounded-lg px-3 py-2 gap-2 text-sm transition-colors duration-200;
        }
        .menu-item-active {
          @apply bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-white;
        }
        .menu-item-inactive {
          @apply text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800;
        }
        .menu-dropdown-item {
          @apply flex items-center w-full rounded-lg px-3 py-2 text-sm gap-2 transition-colors duration-200;
        }
        .menu-dropdown-item-active {
          @apply bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-white;
        }
        .menu-dropdown-item-inactive {
          @apply text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800;
        }
        .menu-dropdown-badge {
          @apply ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white;
        }
      `}</style>
    </>
  );
};

export default AppSidebar;
