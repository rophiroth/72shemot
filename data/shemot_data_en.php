<?php
// English dataset for 72 Names — only 'significado' translated.
// Structure mirrors get72ShemotData(); we copy rows and replace meanings.
require_once __DIR__ . '/shemot_data.php';

function get72ShemotDataEN() {
    $rows = get72ShemotData();
    $en = [
        // 1..72
        "Repentance, doing Teshuvah. Erases the past; return to the moment of Creation.",
        "Protection from death. Resolves psychic issues. Brings redemption closer.",
        "Work miracles.",
        "Remove negative thoughts. Positive thinking; success.",
        "Healing. Strengthens the soul's immune system.",
        "Expand the vessel; prophetic illumination.",
        "Brings order to life.",
        "Cancels harsh decrees; fights the world's negativity.",
        "Influence angels.",
        "Protection against the evil eye. Removes envy. Rebirth (mikveh).",
        "Remove the ego.",
        "Induce love. Transform hatred into love.",
        "Blessing for pregnancy and offspring.",
        "Fight the ego. Resolve conflicts without violence.",
        "See the causal world.",
        "Elevate astral fortune.",
        "Battle the ego.",
        "Build the vessel of blessing.",
        "Redemption. Connection with the Ana BeKoach.",
        "Empower spiritual strength to connect with the Creator.",
        "Strength to go the distance. Second wind; see shortcuts.",
        "Priestly blessing (Cohanim). Source of all blessing; cleanses the aura.",
        "Priestly energy that separates good from evil and clears negativity.",
        "Heals jealousy. Prevents spiritual disconnection.",
        "Connect with truth. Generates continuity.",
        "Bring order to life.",
        "Align with the Light. Exchange severity for harmony.",
        "Find the soulmate.",
        "Shed all hatred.",
        "Reconcile with those in conflict. Overcome the ego.",
        "Non-judgmental acceptance; wholeness.",
        "Draws redemption; connects with messianic consciousness.",
        "Remove our dark side.",
        "Learn to break the ego.",
        "Humility. Sublimate sexuality.",
        "Conquer fear. Healing blessing of the Kohen.",
        "Break the ego. Long-term vision.",
        "Acquire the quality of sharing.",
        "Destroy inner evil. Transform negative situations.",
        "Order and certainty in life.",
        "Blessing to heal all situations.",
        "Reveal secrets. Good before studying Torah.",
        "Help others connect with the Divine; liberate souls.",
        "Connect with mercy; soften judgments.",
        "Create the vessel for abundance at the right moment.",
        "Gain confidence and certainty; success.",
        "Remove blockages and negativity; clear the path.",
        "Attain consciousness of unity.",
        "Learn gratitude.",
        "Attain prophecy.",
        "Forgiveness for past guilt.",
        "Strength to connect.",
        "Strong spiritual defense; restores what was lost.",
        "Continuity; removes the death of projects or relationships.",
        "Strength to achieve goals.",
        "Nullify idolatry (power, money, religiosity…).",
        "Transcend limitations. Power of Sinai.",
        "Makes the Divine fight for me.",
        "Umbilical cord with the Divine.",
        "Free oneself from limitations (ego, bondage…).",
        "Healing force; health.",
        "Connect with the inner teacher.",
        "Humility; virtues of Moses.",
        "Help others; love of one's neighbor.",
        "Awareness to help and not judge.",
        "Resolve conflicts spiritually; remove vengeance.",
        "Power over time.",
        "Correct seminal emission; resolve sexual problems.",
        "Wisdom; blessing for marriage.",
        "Success in business for sharing; removes blockages.",
        "Bestowal of the gift of prophecy.",
        "Remove physical defects. Power of negotiation.",
    ];
    foreach ($rows as $i => &$r) {
        if (isset($r['significado']) && isset($en[$i])) {
            $r['significado'] = $en[$i];
        }
    }
    return $rows;
}

