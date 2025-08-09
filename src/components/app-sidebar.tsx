"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarFooter
} from "@/components/ui/sidebar";
import { calculatorCategories } from "@/lib/calculators";
import { ThemeCustomizer } from "./theme-customizer";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-8 w-8 text-primary">
                <rect width="256" height="256" fill="none"></rect>
                <path d="M128,24a104,104,0,1,0,104,104A104.2,104.2,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM104,100a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,100Zm48,32H104a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Zm-28,36a20,20,0,1,1,20-20A20.1,20.1,0,0,1,124,168Z" fill="currentColor"></path>
            </svg>
          <h1 className="text-2xl font-bold">CalcuZen</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {calculatorCategories.map((category) => (
          <SidebarGroup key={category.name}>
            <SidebarGroupLabel>{category.name}</SidebarGroupLabel>
            <SidebarMenu>
              {category.calculators.map((calc) => (
                <SidebarMenuItem key={calc.slug}>
                  <Link href={calc.slug} className="w-full">
                    <SidebarMenuButton
                      isActive={pathname === calc.slug}
                      tooltip={{ children: calc.name, side: "right" }}
                    >
                      <calc.icon />
                      <span>{calc.name}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <ThemeCustomizer />
      </SidebarFooter>
    </Sidebar>
  );
}
