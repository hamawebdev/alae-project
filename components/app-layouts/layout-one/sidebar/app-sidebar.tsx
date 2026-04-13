"use client"

import * as React from "react"

import { NavMain } from "./nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ROUTES } from "@/components/app-layouts/layout-one/routes"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={ROUTES} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
