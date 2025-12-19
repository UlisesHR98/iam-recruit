"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SETTINGS_SECTIONS } from "./settings-config";

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState(SETTINGS_SECTIONS[0]?.id || "");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {SETTINGS_SECTIONS.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="gap-2">
              {section.icon}
              <span className="hidden sm:inline">{section.label}</span>
              <span className="sm:hidden">{section.label.split(" ")[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {SETTINGS_SECTIONS.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-6">
            <div className="rounded-lg border bg-card p-6">
              {section.component}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
