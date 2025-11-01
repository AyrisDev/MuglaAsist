"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DebugPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test 1: Supabase instance
      const hasSupabase = !!supabase;

      // Test 2: Environment variables
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      // Test 3: Get session and user
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const { data: userData, error: userError } = await supabase.auth.getUser();

      // Test 4: Try a simple query
      const { data: testData, error: testError } = await supabase
        .from('categories')
        .select('count')
        .limit(1);

      // Test 5: Check admin role
      const user = userData?.user;
      const appMetadataRole = user?.app_metadata?.role;
      const userMetadataRole = user?.user_metadata?.role;
      const isAdminRole = appMetadataRole === 'admin' || userMetadataRole === 'admin';

      setStatus({
        supabaseClient: hasSupabase,
        envVars: { hasUrl, hasKey },
        session: {
          exists: !!sessionData.session,
          user: sessionData.session?.user?.email || null,
          error: sessionError?.message || null,
        },
        userData: {
          email: user?.email || null,
          app_metadata: user?.app_metadata || null,
          user_metadata: user?.user_metadata || null,
          isAdmin: isAdminRole,
        },
        dbQuery: {
          success: !testError,
          error: testError?.message || null,
          data: testData,
        },
      });
    } catch (error: any) {
      setStatus({
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "admin@kotekli.edu.tr",
        password: "admin123",
      });

      setStatus({
        loginAttempt: true,
        success: !error,
        error: error?.message || null,
        session: data.session ? "Session created" : "No session",
        user: data.user?.email || null,
      });
    } catch (error: any) {
      setStatus({
        loginAttempt: true,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Debug</h1>

      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Test Connection
        </button>

        <button
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 ml-2"
        >
          Test Login (admin@kotekli.edu.tr)
        </button>
      </div>

      {status && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
