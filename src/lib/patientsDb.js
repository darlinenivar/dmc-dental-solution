// src/lib/patientsDb.js
import { supabase } from "./supabaseClient";

export async function listPatients() {
  const { data, error } = await supabase
    .from("patients")
    .select("id, first_name, last_name, dob, gender, contact, emergency_contact, allergies, email, note, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createPatient(payload) {
  const {
    first_name,
    last_name,
    dob,
    gender,
    contact,
    emergency_contact,
    allergies,
    email,
    note,
  } = payload;

  const userRes = await supabase.auth.getUser();
  const userId = userRes?.data?.user?.id;
  if (!userId) throw new Error("No hay sesión activa.");

  const { data, error } = await supabase
    .from("patients")
    .insert([
      {
        user_id: userId,
        first_name,
        last_name,
        dob,
        gender,
        contact,
        emergency_contact,
        allergies,
        email: email || null,
        note: note || null,
      },
    ])
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function getPatient(id) {
  const { data, error } = await supabase
    .from("patients")
    .select("id, first_name, last_name, dob, gender, contact, emergency_contact, allergies, email, note, created_at")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
