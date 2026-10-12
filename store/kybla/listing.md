# Kybla — App Store listing (iOS 1.0)

**Name (30):** Kybla
**Subtitle (30):** Find your prayer direction (26)
**Bundle ID:** com.afifvdin.Kybla · **Version:** 1.0 (1)
**Primary category:** Lifestyle · **Secondary:** Navigation
**Age rating:** 4+ (answer No / None to every question; Made for Kids unchecked)
**Price:** Free, all countries
**Content Rights:** No, the app doesn't contain, show or access third-party content
**Copyright:** 2026 Afifudin Abdullah

## Promotional text (170)
Point your phone and the arrow shows the way to the Kaaba. Turn until it points straight up and feel a gentle tap. Soft pastel design, no ads, no accounts.

(155 characters)

## Description
A Qibla compass with nothing else on the screen.

An arrow points to the Qibla and the number below it shows how far you are from facing it, with north, east, south and west turning around it. Turn until the arrow points straight up and you'll feel a gentle tap, so you know you're facing the Kaaba without staring at the screen.

• One arrow, pointing to the Qibla
• Degrees to go, counting down to 0°
• Compass ring that turns with you
• Gentle haptic tap when you're facing it
• Soft pastel design
• Works anywhere; your location stays on your device
• No ads, no accounts, no tracking

## Keywords (100)
qibla,kibla,kiblat,compass,kaaba,mecca,makkah,salah,salat,namaz,muslim,islam,arah,kiblah,locator

(96 characters; none repeat the name. "prayer" and "direction" are already in the subtitle.)

## URLs
- **Support URL:** https://afifvdin.com/apps/kybla/support
- **Marketing URL:** https://afifvdin.com/apps/kybla
- **Privacy Policy URL:** https://afifvdin.com/apps/kybla/privacy

## App Privacy (draft)
Based on what actually leaves the device; it matches the privacy text on afifvdin.com/apps/kybla/privacy.

**Not collected:** location. The app reads location and the compass only to compute the bearing to the Kaaba, on the device, while it's open. Nothing about it is stored or sent.

**Collected, only when the user sends feedback** (the speech-bubble sheet posts to feedback.afifvdin.com, which stores it):

| App Privacy data type | What is sent | Linked to user | Tracking | Purpose |
| --- | --- | --- | --- | --- |
| User Content → Customer Support | The feedback message | No | No | App Functionality |
| Contact Info → Email Address | Email, only if the user types one | No | No | App Functionality |
| Diagnostics → Other Diagnostic Data | App version and build, OS version, device model, language | No | No | App Functionality |
| Location → Coarse Location | Country, derived from the request by Cloudflare (no IP address is stored) | No | No | App Functionality |

So the first question is **"Yes, we collect data from this app"**, with the four types above.

Open decisions for the owner:
- **Country → Coarse Location (recommended: declare it).** The feedback worker stores the request's country with each message. Apple counts location at country level as Coarse Location, and the website policy already discloses the country. Declaring it is the safe, consistent choice; the alternative is to stop storing country in the worker first.
- **Linked to user (recommended: No, but check).** Feedback isn't tied to an account or device ID. An email the user chooses to add does identify them, though. If you want the most conservative label, mark Email Address (and Customer Support) as linked. Keep the answers the same as Discreet Tasbeeh's for its feedback sheet.

## Store assets (upload/)
Rendered by the fframes project in `video/` (`ASSET=header|search|shot-6.3-N|shot-6.9-N|shot-duo-N`; see its README) from real simulator captures in `video/assets/`.

| File | App Store Connect slot |
| --- | --- |
| `01-header-3840x1646.png` | Header and Search Results → Header |
| `02-search-results-3840x2560.png` | Header and Search Results → Search Results |
| `03-iphone-6.3-screenshot-{1,2,3}-1206x2622.png` | iPhone screenshots, the slot shown first (6.3"), in order |
| `05-iphone-6.9-screenshot-{1,2,3}-1320x2868.png` | 6.9" display, only if Media Manager asks for it |
| `06-iphone-duo-screenshot-{1,2,3}-1398x2034.png` | iPhone Duo (optional), same captions and captures as 6.3" |

Captions: "The arrow points / to the Qibla." (Jakarta, 65°) · "A compass ring / that turns with you." (London, 119°) · "A gentle tap / when you're facing it." (a point due south of Mecca, 0°).

**No app preview for 1.0.** The simulator has no compass, so a real screen recording can't show the arrow and ring turning. The recreated video (`preview-*.mp4`) is for the website only. A preview can be added later from a recording on a real iPhone.

## Notes for the reviewer (App Review Information → Notes)
Kybla is a Qibla compass: it shows the direction Muslims face to pray (towards the Kaaba in Mecca). The arrow points to the Qibla, the number below shows how many degrees the phone is from facing it, and the N/E/S/W ring turns with the phone's heading. When the arrow points straight up (within 3°), the phone gives a gentle haptic tap.

Location is used only on the device to calculate the bearing and is never stored or sent. The compass needs a real device; in the Simulator the ring stays still and the arrow shows the bearing relative to north.

The speech-bubble button opens an optional feedback form that sends the message (and an email address if the user adds one) to our feedback inbox. No sign-in is required.

## Contact for App Review
Name: Afifudin Abdullah · phone and email: fill in in App Store Connect (use the Apple ID email; hi@afifvdin.com is receive-only). Not written here because this repo is public.
