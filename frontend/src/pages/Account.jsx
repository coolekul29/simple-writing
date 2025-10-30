import React from "react";
import "../styles/account.css";

export default function Account({ userEmail, profile }) {
  // Guard if something hasn't loaded yet
  if (!profile) {
    return (
      <section className="account container">
        <div className="account-card">
          <h2>Account</h2>
          <p>Loading your profile…</p>
        </div>
      </section>
    );
  }

  const {
    tier,
    daily_rewrites_used = 0,
    rewrite_limit_per_day = 0,
    max_words_per_input = 0,
    updated_at,
  } = profile;

  const isPro = tier === "tier3";
  const isStarter = tier === "tier2";
  // eslint-disable-next-line no-unused-vars
  const isFree = tier === "tier1";

  const tierLabel = isPro ? "Pro" : isStarter ? "Starter" : "Free";
  const dailyLimit = rewrite_limit_per_day === -1 ? "Unlimited" : rewrite_limit_per_day;
  const used = daily_rewrites_used || 0;
  const remaining = rewrite_limit_per_day === -1 ? "∞" : Math.max(rewrite_limit_per_day - used, 0);

  // progress % (cap at 100)
  const progress =
    rewrite_limit_per_day === -1
      ? 0
      : Math.min(Math.round((used / Math.max(rewrite_limit_per_day, 1)) * 100), 100);

  return (
    <section className="account container">
      <div className="account-header">
        <div>
          <h1>Account</h1>
          <p className="sub">Manage your plan, usage, and settings.</p>
        </div>
        <div className={`plan-badge ${tierLabel.toLowerCase()}`}>{tierLabel}</div>
      </div>

      <div className="account-grid">
        {/* Profile / Identity */}
        <div className="account-card">
          <h2>Your profile</h2>
          <div className="kv">
            <span>Email</span>
            <strong>{userEmail || "—"}</strong>
          </div>
          <div className="kv">
            <span>Plan</span>
            <strong>{tierLabel}</strong>
          </div>
          <div className="kv">
            <span>Status</span>
            <strong className="status active">Active</strong>
          </div>
          <div className="kv">
            <span>Last updated</span>
            <strong>{updated_at ? new Date(updated_at).toLocaleString() : "—"}</strong>
          </div>
        </div>

        {/* Usage */}
        <div className="account-card">
          <h2>Today’s usage</h2>

          {rewrite_limit_per_day === -1 ? (
            <p>You’re on <strong>Unlimited</strong> daily rewrites.</p>
          ) : (
            <>
              <div className="usage-top">
                <div className="usage-stat">
                  <span>Used</span>
                  <strong>{used}</strong>
                </div>
                <div className="usage-stat">
                  <span>Limit</span>
                  <strong>{dailyLimit}</strong>
                </div>
                <div className="usage-stat">
                  <span>Remaining</span>
                  <strong>{remaining}</strong>
                </div>
              </div>

              <div className="progress">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
            </>
          )}

          <div className="kv mt">
            <span>Max words per input</span>
            <strong>{max_words_per_input}</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="account-card">
          <h2>Actions</h2>
          {!isPro && (
            <>
              <p className="muted">
                Want higher limits and priority support? Upgrade your plan.
              </p>
              <div className="actions">
                {!isStarter && (
                  <button className="btn ghost">Choose Starter</button>
                )}
                <button className="btn primary">Go Pro</button>
              </div>
            </>
          )}
          {isPro && <p className="muted">You’re on Pro. Thank you! 🎉</p>}
        </div>
      </div>
    </section>
  );
}
