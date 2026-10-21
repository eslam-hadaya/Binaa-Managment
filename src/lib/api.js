const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://binaa-server.vercel.app/api";

// دالة مساعدة للـ fetch
async function fetchAPI(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    ...options,
  });

  const text = await res.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || "حدث خطأ");
  }

  return data;
}

// =============================================
// المصادقة
// =============================================

// تسجيل الدخول - الخطوة 1
export async function login(email, password) {
  const data = await fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data;
}

// التحقق من OTP - الخطوة 2
export async function verifyOTP(userId, otp) {
  const data = await fetchAPI("/auth/verify", {
    method: "POST",
    body: JSON.stringify({ userId, otp }),
  });
  return data;
}

// التحقق من الجلسة
export async function checkSession() {
  try {
    const data = await fetchAPI("/auth/session", {
      method: "GET",
    });
    return data;
  } catch (error) {
    return { isAuthenticated: false };
  }
}

// تسجيل الخروج
export async function logout() {
  const data = await fetchAPI("/auth/logout", {
    method: "POST",
  });
  return data;
}

// =============================================
// المقالات
// =============================================

export async function getPosts() {
  const data = await fetchAPI("/posts");
  return data.posts || [];
}

export async function getPost(id) {
  const data = await fetchAPI(`/posts/${id}`);
  return data.post;
}

function assertEnglishTranslationSaved(data, englishTranslation) {
  if (!englishTranslation || typeof englishTranslation !== "object") return;

  const expectedText = (value) =>
    typeof value === "string" ? value.trim() : "";
  const hasEnglishFields = Object.values(englishTranslation).some(
    (value) =>
      (typeof value === "string" && value.trim()) ||
      (Array.isArray(value) && value.length > 0),
  );
  if (!hasEnglishFields) return;

  const savedTranslation = data.post?.translations?.en;
  if (
    !savedTranslation ||
    savedTranslation.title !== expectedText(englishTranslation.title) ||
    savedTranslation.content !== expectedText(englishTranslation.content) ||
    savedTranslation.category !== expectedText(englishTranslation.category)
  ) {
    throw new Error(
      "لم يؤكد الخادم حفظ العنوان والمحتوى والتصنيف الإنجليزي في قاعدة البيانات. لم يتم تأكيد نجاح العملية.",
    );
  }
}

export async function createPost(postData) {
  const data = await fetchAPI("/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });

  if (
    data.success !== true ||
    !data.post
  ) {
    throw new Error(
      "لم يؤكد الخادم حفظ المقالة. تحقق من الاتصال بقاعدة البيانات ثم أعد المحاولة.",
    );
  }

  assertEnglishTranslationSaved(data, postData.englishTranslation);
  return data.post;
}

export async function updatePost(id, postData) {
  const data = await fetchAPI(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(postData),
  });

  if (
    data.success !== true ||
    !data.post ||
    typeof data.englishTranslationAvailable !== "boolean"
  ) {
    throw new Error(
      "لم يؤكد الخادم حفظ التعديل والنسخة الإنجليزية. أعد تشغيل/نشر الخادم المحدّث ثم حاول مجدداً.",
    );
  }

  assertEnglishTranslationSaved(data, postData.englishTranslation);
  return data;
}

export async function deletePost(id) {
  const data = await fetchAPI(`/posts/${id}`, {
    method: "DELETE",
  });
  return data;
}

// =============================================
// الطلبات
// =============================================

export async function getRequests(status = "") {
  const url = status ? `/requests?status=${status}` : "/requests";
  const data = await fetchAPI(url);
  return data.requests || [];
}

export async function updateRequestStatus(
  id,
  status,
  notes = "",
  projectEndDate = "",
  followUpMessage = "",
) {
  const data = await fetchAPI(`/requests/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({
      status,
      notes,
      project_end_date: projectEndDate,
      follow_up_message: followUpMessage,
    }),
  });
  return data.request;
}

// =============================================
// الخدمات
// =============================================

export async function getServices() {
  const data = await fetchAPI("/services");
  return data.services || [];
}

export async function createService(serviceData) {
  const data = await fetchAPI("/services", {
    method: "POST",
    body: JSON.stringify(serviceData),
  });
  return data.service;
}

export async function updateService(id, serviceData) {
  const data = await fetchAPI(`/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(serviceData),
  });
  return data.service;
}

export async function deleteService(id) {
  const data = await fetchAPI(`/services/${id}`, {
    method: "DELETE",
  });
  return data;
}

// =============================================
// الإحصائيات
// =============================================

export async function getVisitors() {
  const data = await fetchAPI("/visitors");
  return data.visitors || [];
}

export async function getVisitorStats() {
  const data = await fetchAPI("/visitors/stats");
  return data.stats;
}

export async function getStats() {
  const data = await fetchAPI("/admin/stats");
  return data.stats;
}

export async function getActivities() {
  const data = await fetchAPI("/admin/activities");
  return data.activities || [];
}
