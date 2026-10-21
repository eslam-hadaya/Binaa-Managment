"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowRight, FiSave, FiLoader } from "react-icons/fi";
import { getPost, updatePost } from "@/lib/api";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [englishTranslationAvailable, setEnglishTranslationAvailable] =
    useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    author: "",
    status: "published",
  });
  const [englishData, setEnglishData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    author: "",
  });
  const hasEnglishFields = Object.values(englishData).some((value) =>
    value.trim(),
  );

  useEffect(() => {
    let isActive = true;

    async function loadPost() {
      try {
        const data = await getPost(postId);
        if (!isActive) return;

        setFormData({
          title: data.title || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          category: data.category || "",
          tags: data.tags?.join(", ") || "",
          author: data.author || "إسلام هداية",
          status: data.status || "published",
        });
        const english = data.translations?.en || {};
        setEnglishData({
          title: english.title || "",
          excerpt: english.excerpt || "",
          content: english.content || "",
          category: english.category || "",
          tags: Array.isArray(english.tags) ? english.tags.join(", ") : "",
          author: english.author || "",
        });
        setEnglishTranslationAvailable(
          typeof english.title === "string" &&
            Boolean(english.title.trim()) &&
            typeof english.content === "string" &&
            Boolean(english.content.trim()),
        );
      } catch (error) {
        if (isActive) {
          setMessage({
            type: "error",
            text: error.message || "حدث خطأ في جلب المقالة",
          });
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    void loadPost();
    return () => {
      isActive = false;
    };
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnglishChange = (e) => {
    const { name, value } = e.target;
    setEnglishData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const data = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        englishTranslation: {
          ...englishData,
          tags: englishData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        },
      };
      const result = await updatePost(postId, data);
      setEnglishTranslationAvailable(result.englishTranslationAvailable);
      setMessage({
        type: "success",
        text: result.englishTranslationAvailable
          ? "تم حفظ التعديل والنسخة الإنجليزية في قاعدة البيانات."
          : "تم حفظ التعديل. لا توجد نسخة إنجليزية محفوظة لهذا المقال.",
      });
      setTimeout(() => router.push("/admin/posts"), 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "حدث خطأ في التحديث",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[var(--text-muted)]">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            تعديل المقالة
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            تحديث محتوى المقالة
          </p>
        </div>
        <Link
          href="/admin/posts"
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <FiArrowRight size={16} />
          العودة للمقالات
        </Link>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--nav-bg)] border border-[var(--nav-border]) rounded-2xl p-6 space-y-5"
      >
        <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4 text-sm text-[var(--text-muted)]">
          {englishTranslationAvailable
            ? "توجد نسخة إنجليزية محفوظة لهذا المقال."
            : "لا توجد نسخة إنجليزية محفوظة. يمكنك إضافة نسخة اختيارياً."}
          <p className="mt-1 text-xs">
            أدخل العنوان والمحتوى الإنجليزي معاً، أو اترك حقول الإنجليزية
            فارغة لإزالة النسخة الإنجليزية.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            العنوان *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            placeholder="عنوان المقالة..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            الملخص
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
            placeholder="ملخص قصير للمقالة..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            المحتوى *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={12}
            className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none font-mono"
            placeholder="محتوى المقالة (يدعم Markdown)..."
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              التصنيف
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              placeholder="مثل: تقنية"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              الوسوم
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              placeholder="مفصولة بفواصل"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              الكاتب
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              placeholder="اسم الكاتب"
            />
          </div>
        </div>

        <section className="space-y-4 rounded-2xl border border-[var(--nav-border)] p-5">
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">
              English version (optional)
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              أدخل العنوان والمحتوى والتصنيف الإنجليزي معاً. اتركها فارغة
              لإزالة النسخة الإنجليزية عند الحفظ.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              English title
            </label>
            <input
              type="text"
              name="title"
              value={englishData.title}
              onChange={handleEnglishChange}
              required={hasEnglishFields}
              dir="ltr"
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              placeholder="Article title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              English excerpt
            </label>
            <textarea
              name="excerpt"
              value={englishData.excerpt}
              onChange={handleEnglishChange}
              rows={2}
              dir="ltr"
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
              placeholder="Short article summary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              English content
            </label>
            <textarea
              name="content"
              value={englishData.content}
              onChange={handleEnglishChange}
              required={hasEnglishFields}
              rows={12}
              dir="ltr"
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none font-mono"
              placeholder="English article content (Markdown supported)"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                English category
              </label>
              <input
                type="text"
                name="category"
                value={englishData.category}
                onChange={handleEnglishChange}
                required={hasEnglishFields}
                dir="ltr"
                className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                English tags
              </label>
              <input
                type="text"
                name="tags"
                value={englishData.tags}
                onChange={handleEnglishChange}
                dir="ltr"
                className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                placeholder="Comma separated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                English author
              </label>
              <input
                type="text"
                name="author"
                value={englishData.author}
                onChange={handleEnglishChange}
                dir="ltr"
                className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
          </div>
        </section>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            الحالة
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          >
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--nav-border])">
          <Link
            href="/admin/posts"
            className="px-4 py-2 rounded-xl border border-[var(--nav-border]) text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors text-sm"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
          >
            {saving
              ? formData.status === "published"
                ? "جارٍ حفظ التغييرات..."
                : "جارٍ حفظ التغييرات..."
              : "حفظ التغييرات"}
            {saving ? (
              <FiLoader className="animate-spin" size={16} />
            ) : (
              <FiSave size={16} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
