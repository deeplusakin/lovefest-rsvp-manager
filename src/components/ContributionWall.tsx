
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Contribution {
  id: string;
  amount: number;
  message: string;
  created_at: string;
  guests: {
    first_name: string;
    last_name: string;
  } | null;
}

export const ContributionWall = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(!!data?.is_admin);
      }
    };

    checkAdminStatus();
  }, []);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const { data, error } = await supabase
          .from("contributions")
          .select(`
            id,
            amount,
            message,
            created_at,
            guests (
              first_name,
              last_name
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setContributions(data || []);
      } catch (error: any) {
        console.error("Error fetching contributions:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributions();

    // Subscribe to new contributions
    const channel = supabase
      .channel("contributions-channel")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "contributions",
        },
        async () => {
          // Refresh the contributions when any change occurs
          const { data } = await supabase
            .from("contributions")
            .select(`
              id,
              amount,
              message,
              created_at,
              guests (
                first_name,
                last_name
              )
            `)
            .order("created_at", { ascending: false });

          if (data) {
            setContributions(data);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contributions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Failed to delete message");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-12">
          Messages from Our Guests
        </h2>
        <div className="grid gap-6">
          {contributions.map((contribution, index) => (
            <motion.div
              key={contribution.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-medium text-lg">
                    {contribution.guests 
                      ? `${contribution.guests.first_name} ${contribution.guests.last_name}`
                      : "Anonymous Guest"
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(contribution.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {contribution.amount > 0 && (
                    <div className="text-lg font-medium text-primary">
                      ${contribution.amount}
                    </div>
                  )}
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(contribution.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              {contribution.message && (
                <p className="text-gray-700">{contribution.message}</p>
              )}
            </motion.div>
          ))}
          {contributions.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Be the first to share!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
