// Third-party browser files served from our own origin, so the Content-Security-Policy can stay
// script-src 'self'. Published path → file in node_modules. Used by the build and the dev server.
export const vendorFiles = {
  "/assets/vendor/supabase.js":
    "node_modules/@supabase/supabase-js/dist/umd/supabase.js",
  "/assets/vendor/elevenlabs/client.js":
    "node_modules/@elevenlabs/client/dist/lib.iife.js",
  "/assets/vendor/elevenlabs/rawAudioProcessor.js":
    "node_modules/@elevenlabs/client/worklets/rawAudioProcessor.js",
  "/assets/vendor/elevenlabs/audioConcatProcessor.js":
    "node_modules/@elevenlabs/client/worklets/audioConcatProcessor.js",
  "/assets/vendor/elevenlabs/libsamplerate.worklet.js":
    "node_modules/@alexanderolsen/libsamplerate-js/dist/libsamplerate.worklet.js",
};
