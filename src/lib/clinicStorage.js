const KEY = "dmc_clinic_profile_v1";

const DEFAULT = {
  name: "Centro Odontológico",
  phone: "",
  email: "",
  address: "",
  rnc: "",
  logoDataUrl: "",
  stampDataUrl: "",
  signatureDataUrl: "",
  footerNote: "Gracias por su preferencia.",
};

export function loadClinicProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  } catch {
    return { ...DEFAULT };
  }
}

export function saveClinicProfile(profile) {
  localStorage.setItem(KEY, JSON.stringify(profile));
}
