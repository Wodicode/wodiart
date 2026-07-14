"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  BUDGET_RANGES,
  BUSINESS_STAGES,
  MIN_DETAILS_LENGTH,
  OTHER_NEED,
  PROJECT_NEEDS,
  TIMELINES,
} from "@/lib/constants";

type BudgetChoice = "unsure" | "has-budget";
type Status = "idle" | "loading" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function IntakeForm() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [needsOther, setNeedsOther] = useState("");
  const [details, setDetails] = useState("");
  const [budgetChoice, setBudgetChoice] = useState<BudgetChoice>("unsure");
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const detailsLength = details.trim().length;
  const detailsMet = detailsLength >= MIN_DETAILS_LENGTH;
  const needsOtherSelected = needs.includes(OTHER_NEED);

  const isValid = useMemo(() => {
    return (
      name.trim().length > 0 &&
      brand.trim().length > 0 &&
      EMAIL_PATTERN.test(email.trim()) &&
      phone.trim().length > 0 &&
      stage.length > 0 &&
      needs.length > 0 &&
      (!needsOtherSelected || needsOther.trim().length > 0) &&
      detailsMet &&
      timeline.length > 0 &&
      (budgetChoice === "unsure" || budgetRange.length > 0)
    );
  }, [
    name,
    brand,
    email,
    phone,
    stage,
    needs,
    needsOtherSelected,
    needsOther,
    detailsMet,
    timeline,
    budgetChoice,
    budgetRange,
  ]);

  function toggleNeed(value: string) {
    setNeeds((prev) =>
      prev.includes(value) ? prev.filter((n) => n !== value) : [...prev, value]
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid || status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          brand,
          email,
          phone,
          stage,
          needs,
          needsOther: needsOtherSelected ? needsOther.trim() : "",
          details,
          budget: budgetChoice === "unsure" ? "Help me understand what this costs" : budgetRange,
          timeline,
        }),
      });

      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Something went wrong sending your request. Please try again, or reach us directly below."
      );
    }
  }

  if (status === "success") {
    return (
      <section id="form" className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="max-w-content border-t border-gray-800 pt-16">
          <p className="font-display text-3xl font-bold sm:text-4xl">Request received.</p>
          <p className="mt-3 text-lg text-gray-300">We&apos;ll be in touch within 48 hours.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="form" className="px-6 py-24 sm:px-10 lg:px-16">
      <div className="max-w-content">
        <div className="border-t border-gray-800 pt-16">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Tell us about it</h2>
          <p className="mt-3 max-w-lg text-gray-400">
            The more context you give us, the faster we can tell you if we&apos;re the right
            fit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-14 space-y-14" noValidate>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="field-label">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="brand" className="field-label">
                Business / brand name
              </label>
              <input
                id="brand"
                name="brand"
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="phone" className="field-label">
                Phone / WhatsApp number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="field-input"
              />
            </div>

            <div>
              <label htmlFor="stage" className="field-label">
                Business stage
              </label>
              <select
                id="stage"
                name="stage"
                required
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="field-select"
              >
                <option value="" disabled>
                  Select one
                </option>
                {BUSINESS_STAGES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="timeline" className="field-label">
                Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                required
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="field-select"
              >
                <option value="" disabled>
                  Select one
                </option>
                {TIMELINES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset>
            <legend className="field-label">What do you need?</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PROJECT_NEEDS.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 border border-gray-700 px-4 py-3 transition-colors has-[:checked]:border-paper has-[:checked]:bg-paper has-[:checked]:text-ink"
                >
                  <input
                    type="checkbox"
                    name="needs"
                    value={option}
                    checked={needs.includes(option)}
                    onChange={() => toggleNeed(option)}
                    className="h-4 w-4 shrink-0 accent-[#0A0A0A]"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>

            {needsOtherSelected && (
              <div className="mt-4">
                <label htmlFor="needsOther" className="sr-only">
                  Tell us what you need
                </label>
                <input
                  id="needsOther"
                  name="needsOther"
                  type="text"
                  required
                  value={needsOther}
                  onChange={(e) => setNeedsOther(e.target.value)}
                  placeholder="Tell us what you need"
                  className="field-input"
                />
              </div>
            )}
          </fieldset>

          <div>
            <label htmlFor="details" className="field-label">
              Project details
            </label>
            <textarea
              id="details"
              name="details"
              required
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              aria-describedby="details-counter"
              placeholder="Tell us about the project — what the business does, where it is now, and what you're hoping the brand achieves."
              className="field-input resize-none"
            />
            <p
              id="details-counter"
              aria-live="polite"
              className={`mt-2 text-xs ${detailsMet ? "text-gray-400" : "text-gray-500"}`}
            >
              {detailsLength} / {MIN_DETAILS_LENGTH} characters minimum
            </p>
          </div>

          <fieldset>
            <legend className="field-label">Budget</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label
                className={`cursor-pointer border px-5 py-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-paper ${
                  budgetChoice === "unsure"
                    ? "border-paper bg-paper text-ink"
                    : "border-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="budgetChoice"
                  value="unsure"
                  checked={budgetChoice === "unsure"}
                  onChange={() => setBudgetChoice("unsure")}
                  className="sr-only"
                />
                <span className="text-sm font-medium">Help me understand what this costs</span>
              </label>

              <label
                className={`cursor-pointer border px-5 py-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-paper ${
                  budgetChoice === "has-budget"
                    ? "border-paper bg-paper text-ink"
                    : "border-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="budgetChoice"
                  value="has-budget"
                  checked={budgetChoice === "has-budget"}
                  onChange={() => setBudgetChoice("has-budget")}
                  className="sr-only"
                />
                <span className="text-sm font-medium">I have a budget in mind</span>
              </label>
            </div>

            {budgetChoice === "has-budget" && (
              <div className="mt-6 max-w-xs">
                <label htmlFor="budgetRange" className="field-label">
                  Range
                </label>
                <select
                  id="budgetRange"
                  name="budgetRange"
                  required
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="field-select"
                >
                  <option value="" disabled>
                    Select a range
                  </option>
                  {BUDGET_RANGES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </fieldset>

          <div>
            <button
              type="submit"
              disabled={!isValid || status === "loading"}
              className="w-full bg-paper px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto"
            >
              {status === "loading" ? "Sending…" : "Send request"}
            </button>
            {status === "error" && (
              <p role="alert" className="mt-4 text-sm text-gray-300">
                {errorMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
