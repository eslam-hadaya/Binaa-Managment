"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiCheckCircle,
} from "react-icons/fi";
import { getPosts, deletePost } from "@/lib/api";

const BLOG_URL = (
  process.env.NEXT_PUBLIC_BLOG_URL || "http://localhost:3000"
).replace(/\/+$/, "");

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function loadPosts() {
      try {
        const data = await getPosts();
        if (isActive) setPosts(data);
      } catch (error) {
        console.error("خطأ:", error);
        if (isActive) {
          setMessage({ type: "error", text: "حدث خطأ في جلب المقالات" });
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    void loadPosts();
    return () => {
      isActive = false;
    };
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error("خطأ:", error);
      setMessage({ type: "error", text: "حدث خطأ في جلب المقالات" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه المقالة؟")) return;

    try {
      await deletePost(id);
      setMessage({ type: "success", text: "تم حذف المقالة بنجاح" });
      setDeleteId(null);
      fetchPosts();
    } catch (error) {
      setMessage({ type: "error", text: error.message || "حدث خطأ في الحذف" });
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            المقالات
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            إدارة مقالات المدونة
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
          >
            <FiPlus size={16} />
            مقالة جديدة
          </Link>
          <button
            onClick={fetchPosts}
            className="p-2 rounded-xl bg-[var(--nav-bg)] border border-[var(--nav-border]) text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <FiRefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* رسائل الحالة */}
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

      {/* جدول المقالات */}
      <div className="bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--background)] border-b border-[var(--nav-border])">
              <tr>
                <th className="p-3.5 text-right text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
                  العنوان
                </th>
                <th className="p-3.5 text-right text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
                  التصنيف
                </th>
                <th className="p-3.5 text-right text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
                  المشاهدات
                </th>
                <th className="p-3.5 text-right text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
                  الترجمة
                </th>
                <th className="p-3.5 text-right text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
                  التاريخ
                </th>
                <th className="p-3.5 text-center text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nav-border)]/80">
              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-[var(--text-muted)]"
                  >
                    لا توجد مقالات
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-[var(--background)]/30 transition-colors duration-200"
                  >
                    <td className="p-3.5 align-middle">
                      <p className="font-semibold text-[var(--foreground)] line-clamp-1">
                        {post.title}
                      </p>
                      {post.excerpt && (
                        <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-1">
                          {post.excerpt}
                        </p>
                      )}
                    </td>
                    <td className="p-3.5 align-middle">
                      <span className="inline-flex items-center rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-2.5 py-1 text-[10px] font-medium text-[var(--primary)]">
                        {post.category || "غير مصنف"}
                      </span>
                    </td>
                    <td className="p-3.5 align-middle text-sm font-medium text-[var(--foreground)]">
                      {post.views || 0}
                    </td>
                    <td className="p-3.5 align-middle">
                      {post.englishTranslationAvailable ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                          <FiCheckCircle size={13} />
                          English
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--nav-border)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-muted)]">
                          عربي فقط
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 align-middle text-sm text-[var(--text-muted)]">
                      {new Date(post.created_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="p-3.5 align-middle">
                      <div className="flex items-center justify-center gap-2">
                        {post.status === "published" ? (
                          <a
                            href={`${BLOG_URL}/blog/${encodeURIComponent(post.slug)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`عرض المقال: ${post.title}`}
                            title="عرض المقال"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-500 transition hover:bg-sky-500/20"
                          >
                            <FiEye size={16} />
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled
                            aria-label="عرض المقال متاح بعد النشر"
                            title="يتاح عرض المقال بعد نشره"
                            className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-[var(--nav-border)] text-[var(--text-muted)] opacity-50"
                          >
                            <FiEye size={16} />
                          </button>
                        )}
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-yellow-500/20 bg-yellow-500/10 text-yellow-500 transition hover:bg-yellow-500/20"
                        >
                          <FiEdit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 transition hover:bg-red-500/20"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
