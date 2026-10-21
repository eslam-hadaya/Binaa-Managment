"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowRight, FiLoader, FiSave } from "react-icons/fi";
import { createPost } from "@/lib/api";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    author: "Eslam hadaya",
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
    setLoading(true);
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
      await createPost(data);
      router.push("/admin/posts");
    } catch (error) {
      setMessage({ type: "error", text: error.message || "حدث خطأ في النشر" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            مقالة جديدة
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            أضف مقالة جديدة إلى المدونة
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
          يمكنك إضافة نسخة إنجليزية اختيارياً. إذا بدأت بها، أدخل العنوان
          والمحتوى الإنجليزي معاً؛ تحفظ النسخة في قاعدة البيانات دون ترجمة آلية.
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
            rows={10}
            className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none font-mono"
            placeholder="محتوى المقالة (يدعم Markdown)..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
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
              placeholder="Next.js, React, (مفصولة بفواصل)"
            />
          </div>
        </div>

        <section className="space-y-4 rounded-2xl border border-[var(--nav-border)] p-5">
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">
              النسخة الإنجليزية (اختياري)
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              اتركها فارغة إذا لم تكن تريد عرض المقال بالإنجليزية. أدخل العنوان
              والمحتوى والتصنيف الإنجليزي معاً عند إضافة النسخة.
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
              rows={10}
              dir="ltr"
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none font-mono"
              placeholder="English article content (Markdown supported)"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
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

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--nav-border])">
          <Link
            href="/admin/posts"
            className="px-4 py-2 rounded-xl border border-[var(--nav-border)] text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors text-sm"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
          >
            {loading
              ? formData.status === "published"
                ? "جارٍ حفظ المقال ونشره..."
                : "جارٍ حفظ المسودة..."
              : formData.status === "published"
                ? "ترجمة المقالة ونشرها"
                : "حفظ كمسودة"}
            {loading ? (
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
