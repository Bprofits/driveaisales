/* Drive AI Core — click any capability node to open a rich stat card.
   Self-contained: builds its own modal, reads .chip-node[data-node]. */
(function () {
  var DATA = {
    phone: {
      eyebrow: "Voice · Inbound + Outbound",
      title: 'Phone <em>AI</em>',
      desc: "A voice agent that answers every inbound and overflow call, runs outbound follow-ups, qualifies the caller and books the appointment, then briefs a human before any live transfer. Speaks 50+ languages, and for booking and qualifying, most callers never realize it isn't one of your people.",
      stats: [{ n: "2 rings", l: "Answered within" }, { n: "50+", l: "Languages spoken" }, { n: "24/7", l: "Never a missed call" }],
      how: "9:48pm. A buyer calls about a used Tacoma. Phone AI answers on the second ring, confirms it's on the lot, books a Saturday test drive, and texts the confirmation. Your team sees the appointment already booked when they walk in at 8am."
    },
    sms: {
      eyebrow: "Text · Two-Way",
      title: 'SMS / <em>Text</em>',
      desc: "Instant two-way texting that replies in seconds, runs multi-day follow-up cadences, and re-engages cold leads, on the one channel buyers actually answer.",
      stats: [{ n: "12s", l: "First reply" }, { n: "98%", l: "Text open rate" }, { n: "6x", l: "More replies vs email" }],
      how: "Lead texts “still available?” at 11pm. Drive AI replies in 12 seconds: “Yes, the 2021 Tacoma TRD is on the lot. Want me to hold it and book you in tomorrow at 4?” Booked before your competitor opens."
    },
    email: {
      eyebrow: "Email · Sequenced",
      title: '<em>Email</em>',
      desc: "Personalized, sequenced email that adapts to where the lead is, new inquiry, no-show, post-visit, dormant, with matching inventory and quote details pulled in automatically.",
      stats: [{ n: "8-touch", l: "Auto cadence" }, { n: "44%", l: "More replies" }, { n: "0", l: "Manual sends" }],
      how: "A 90-day-old lead gets a “still looking?” email with three matching units from today's inventory and a one-tap booking link. Nobody on your team lifted a finger."
    },
    facebook: {
      eyebrow: "Social · Messenger + Marketplace",
      title: 'Facebook <em>DMs</em>',
      desc: "Answers Marketplace and Page messages the moment they land, qualifies the buyer and books them, so Marketplace leads stop dying unread in your inbox.",
      stats: [{ n: "<60s", l: "Reply time" }, { n: "100%", l: "Messages answered" }, { n: "24/7", l: "Coverage" }],
      how: "Marketplace ping at 2am: “is this still for sale?” Drive AI answers instantly, qualifies the buyer, and drops a booking link. You wake up to an appointment, not a missed lead."
    },
    instagram: {
      eyebrow: "Social · DMs + Stories",
      title: 'Instagram <em>DMs</em>',
      desc: "Replies to DMs and story mentions, qualifies, and routes the hot ones to your team, turning the audience you already built into booked appointments.",
      stats: [{ n: "<60s", l: "Reply time" }, { n: "100%", l: "DMs + story replies" }, { n: "24/7", l: "Always on" }],
      how: "Someone replies to your inventory story with “price?”. Drive AI DMs back in seconds with the number, the highlights, and a booking link, while they're still scrolling."
    },
    appointments: {
      eyebrow: "Outcome · Show Rate",
      title: '<em>Appointments</em>',
      desc: "Books, confirms, and reminds, by SMS the night before and the morning of, so your booked traffic actually walks through the door instead of ghosting.",
      stats: [{ n: "41→68%", l: "Show rate" }, { n: "2", l: "Auto reminders each" }, { n: "0", l: "Manual confirms" }],
      how: "Booked Tuesday 4pm, auto-confirmed on the spot. Reminder text at 7pm Monday and 9am Tuesday. They show up. Your team just closes."
    },
    leadqual: {
      eyebrow: "Intelligence · Routing",
      title: 'Lead <em>Qualification</em>',
      desc: "Every lead is engaged, scored, and routed, ready-to-buy goes straight to your team with full context, everyone else gets nurtured automatically, so reps only spend time on deals worth closing.",
      stats: [{ n: "100%", l: "Leads worked" }, { n: "21x", l: "More likely to convert*" }, { n: "0", l: "Leads ignored" }],
      how: "Three leads land at once. Drive AI engages all three, spots the one ready to buy this week, and pings your rep with the full thread, while the other two drop into a follow-up cadence.",
      foot: "*Leads contacted within 5 minutes vs 30 (Lead Response Management study)."
    },
    custom: {
      eyebrow: "Tailored · Built For You",
      title: 'Custom <em>Automations</em>',
      desc: "Whatever your store does by hand, equity mining, service-to-sales, trade-in follow-up, win-backs, we build it into a workflow that runs 24/7 inside the CRM you already use.",
      stats: [{ n: "24/7", l: "Always running" }, { n: "Your", l: "Exact process" }, { n: "90-day", l: "Custom build" }],
      how: "Your service lane flags a 2019 with 80k km and positive equity. An automation texts the owner a pre-approved upgrade offer, books the appraisal, and tells sales, automatically."
    }
  };

  var modal = document.createElement('div');
  modal.className = 'node-modal';
  modal.id = 'nodeModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = '<div class="node-modal-inner" id="nodeModalInner"></div>';
  document.body.appendChild(modal);
  var inner = modal.querySelector('#nodeModalInner');
  var lastFocus = null;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function populate(d) {
    var stats = d.stats.map(function (s) {
      return '<div class="nm-stat"><div class="num">' + esc(s.n) + '</div><div class="lbl">' + esc(s.l) + '</div></div>';
    }).join('');
    var foot = d.foot ? '<div class="nm-foot">' + esc(d.foot) + '</div>' : '';
    inner.innerHTML =
      '<button class="nm-close" aria-label="Close">✕</button>' +
      '<div class="nm-eyebrow">' + esc(d.eyebrow) + '</div>' +
      '<h3 class="nm-title">' + d.title + '</h3>' +
      '<div class="nm-desc">' + esc(d.desc) + '</div>' +
      '<div class="nm-stats">' + stats + '</div>' +
      '<div class="nm-how"><div class="nm-how-lbl">How it actually looks</div><div class="nm-how-txt">' + esc(d.how) + '</div></div>' +
      foot;
  }

  function open(key) {
    var d = DATA[key]; if (!d) return;
    lastFocus = document.activeElement;
    populate(d);
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    if (window.__lenis) window.__lenis.stop();
    var c = inner.querySelector('.nm-close'); if (c) c.focus();
  }
  function close() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    if (window.__lenis) window.__lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  modal.addEventListener('click', function (e) {
    if (e.target === modal || (e.target.closest && e.target.closest('.nm-close'))) close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('show')) close(); });

  document.querySelectorAll('.chip-node[data-node]').forEach(function (n) {
    n.addEventListener('click', function () { open(n.getAttribute('data-node')); });
    n.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n.getAttribute('data-node')); }
    });
  });
})();
