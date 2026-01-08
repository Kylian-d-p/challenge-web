"use client";

import InfiniteScroll from "@/components/ui/infinite-scroll";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import { Calendar, Mail, ShieldCheck, User, Users } from "lucide-react";
import { useState } from "react";
import { getUsersAction } from "./action";

dayjs.locale("fr");
dayjs.extend(relativeTime);

type User = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
  _count: {
    bookings: number;
  };
};

export default function UsersClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [hasMore, setHasMore] = useState(initialUsers.length === 20);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const lastUser = users[users.length - 1];

    const result = await getUsersAction({ cursor: lastUser.id, limit: 20 });

    if (result?.data) {
      setUsers((prev) => [...prev, ...result.data!.users]);
      setHasMore(result.data!.hasMore);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4">
      {/* En-tête */}
      <div className="border-b pb-4">
        <h1 className="font-bold text-3xl md:text-4xl bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Utilisateurs</h1>
        <p className="text-muted-foreground text-sm mt-1">Consultez la liste de tous les utilisateurs de l&apos;application</p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total utilisateurs</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{users.length}</p>
            </div>
            <Users className="w-10 h-10 text-blue-600 dark:text-blue-400 opacity-70" />
          </div>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Administrateurs</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">{users.filter((u) => u.role === "ADMIN").length}</p>
            </div>
            <ShieldCheck className="w-10 h-10 text-green-600 dark:text-green-400 opacity-70" />
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Réservations totales</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                {users.reduce((acc, user) => acc + user._count.bookings, 0)}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-purple-600 dark:text-purple-400 opacity-70" />
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <InfiniteScroll getMore={loadMore} hasMore={hasMore} loading={loading}>
          <div className="divide-y">
            {users.map((user) => (
              <div key={user.id} className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-primary" />
                    </div>

                    {/* Informations utilisateur */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        {user.role === "ADMIN" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            <ShieldCheck className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-muted-foreground mt-1">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm truncate">{user.email}</span>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Inscrit {dayjs(user.createdAt).fromNow()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>
                            {user._count.bookings} réservation{user._count.bookings > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading && (
            <div className="p-8 text-center text-muted-foreground">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm">Chargement...</p>
            </div>
          )}
        </InfiniteScroll>
      </div>

      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-lg">
          <Users className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg mb-2">Aucun utilisateur trouvé</p>
          <p className="text-sm text-muted-foreground">La liste des utilisateurs apparaîtra ici</p>
        </div>
      )}
    </div>
  );
}
