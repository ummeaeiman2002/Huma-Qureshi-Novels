"use client";

import { useState } from "react";
import type { ObjectInputProps } from "sanity";

type Language = "ur" | "en";

const LABELS: Record<Language, string> = {
  ur: "اردو / Urdu",
  en: "English",
};

/**
 * Reusable tabbed input for every localized object.
 *
 * Each localized field is a separate object with its own `ur` and `en`
 * values, so switching language in one field never changes another field.
 */
export default function LocalizedInput(props: ObjectInputProps) {
  const value = (props.value || {}) as { ur?: unknown; en?: unknown };
  const [language, setLanguage] = useState<Language>(value.ur ? "ur" : "en");

  const members = props.members.filter(
    (member) => (member as { name?: string }).name === language,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        role="group"
        aria-label="Language for this field"
        style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
      >
        {(Object.keys(LABELS) as Language[]).map((key) => {
          const active = language === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => setLanguage(key)}
              style={{
                appearance: "none",
                border: `1px solid ${active ? "#292824" : "#DED4C5"}`,
                background: active ? "#292824" : "#FFFCF7",
                color: active ? "#FFFCF7" : "#292824",
                borderRadius: 999,
                padding: "5px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {LABELS[key]}
            </button>
          );
        })}
        <span
          style={{
            alignSelf: "center",
            color: "#625D54",
            fontSize: 12,
            marginInlineStart: 4,
          }}
        >
          {language === "ur"
            ? "Only this field's Urdu value is shown."
            : "Only this field's English value is shown."}
        </span>
      </div>
      {props.renderDefault({ ...props, members } as never)}
    </div>
  );
}
