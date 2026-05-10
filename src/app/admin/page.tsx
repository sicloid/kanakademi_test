import { cookies } from "next/headers";
import { loginAdmin } from "./actions";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  const isAuthenticated = token === process.env.ADMIN_PASSWORD;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9]">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
          <img
            src="https://kanakademi.com.tr/wp-content/uploads/2024/08/kanakademi-logo.png"
            alt="Logo"
            className="h-10 mx-auto mb-8"
          />
          <h1 className="text-xl font-bold text-center mb-6 text-secondary">Admin Girişi</h1>
          <form action={loginAdmin} className="flex flex-col gap-4">
            <input
              type="password"
              name="password"
              placeholder="Yönetici Parolası"
              className="border p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              required
            />
            <button
              type="submit"
              className="bg-primary text-white p-3 rounded-xl font-bold hover:bg-opacity-90"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Fetch Stats
  const totalTests = await prisma.testResult.count();
  
  const profiles = await prisma.testResult.groupBy({
    by: ['profile'],
    _count: {
      profile: true,
    },
  });

  const recentTests = await prisma.testResult.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <img
            src="https://kanakademi.com.tr/wp-content/uploads/2024/08/kanakademi-logo.png"
            alt="Logo"
            className="h-12"
          />
          <h1 className="text-3xl font-black text-secondary">Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-semibold mb-2">Toplam Çözüm</h3>
            <p className="text-4xl font-black text-primary">{totalTests}</p>
          </div>
          
          {profiles.map((p) => (
            <div key={p.profile} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 font-semibold mb-2">{p.profile}</h3>
              <p className="text-4xl font-black text-secondary">{p._count.profile}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-secondary">Son Çözümler</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4">Tarih</th>
                <th className="p-4">Skor</th>
                <th className="p-4">Profil Sonucu</th>
              </tr>
            </thead>
            <tbody>
              {recentTests.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">Henüz test çözen yok.</td>
                </tr>
              ) : (
                recentTests.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50">
                    <td className="p-4 text-gray-600">
                      {new Date(t.createdAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="p-4 font-bold text-primary">{t.score}</td>
                    <td className="p-4">
                      <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-semibold">
                        {t.profile}
                      </span>
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
