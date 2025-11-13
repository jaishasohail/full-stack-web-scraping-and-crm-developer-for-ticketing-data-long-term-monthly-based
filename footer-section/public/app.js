js(function () {
 "use strict";

 /**
 * Simple client-side analytics logger.
 * In a real setup this would send to an API endpoint.
 */
 function logInteraction(eventName, payload) {
 try {
 const timestamp = new Date().toISOString();
 const entry = { event: eventName, timestamp, payload };
 // For demo purposes we just log to the console.
 console.info("[bitbash-demo]", entry);
 } catch (err) {
 // Swallow logging errors; this should never block UI.
 console.error("Failed to log interaction", err);
 }
 }

 function onCtaClick(event) {
 const target = event.currentTarget;
 const label = target.textContent.trim();
 const source = target.getAttribute("data-track") || "unknown";

 logInteraction("cta_click", {
 label,
 source,
 href: target.getAttribute("href")
 });
 }

 function hydrateCtas() {
 const buttons = document.querySelectorAll("[data-track]");
 buttons.forEach((btn) => {
 btn.addEventListener("click", onCtaClick);
 });
 }

 function markReady() {
 document.documentElement.dataset.footerDemoReady = "true";
 }

 function init() {
 try {
 hydrateCtas();
 markReady();
 logInteraction("page_view", {
 path: window.location.pathname,
 title: document.title
 });
 } catch (err) {
 console.error("Failed to initialize footer demo", err);
 }
 }

 if (document.readyState === "loading") {
 document.addEventListener("DOMContentLoaded", init, { once: true });
 } else {
 init();
 }
})();