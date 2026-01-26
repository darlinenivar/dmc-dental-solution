import { supabase } from "./supabaseClient";

export async function signUpWithClinic({
  firstName,
  lastName,
  clinicName,
  phone,
  email,
  password,
}) {
  // 1) Crear usuario en Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;

  const user = data?.user;
  if (!user?.id) throw new Error("No se pudo crear el usuario.");

  // 2) Crear profile
  const { error: eProfile } = await supabase.from("profiles").insert({
    id: user.id,
    first_name: firstName,
    last_name: lastName,
    phone: phone || null,
  });
  if (eProfile) throw eProfile;

  // 3) Crear clínica (owner = user)
  const { data: clinicRow, error: eClinic } = await supabase
    .from("clinics")
    .insert({
      name: clinicName,
      phone: phone || null,
      owner_id: user.id,
    })
    .select("id")
    .single();

  if (eClinic) throw eClinic;

  // 4) Membership
  const { error: eMember } = await supabase.from("clinic_members").insert({
    clinic_id: clinicRow.id,
    user_id: user.id,
    role: "owner",
  });
  if (eMember) throw eMember;

  return { userId: user.id, clinicId: clinicRow.id };
}
