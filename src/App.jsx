import { useEffect, useRef, useState } from "react";

/* ---------------- CORE SCROLL STATE ---------------- */

function useSectionState(ref) {
  const [state, setState] = useState({ progress: 0, active: false });

  useEffect(() => {
    function update() {
      if (!ref.current) return;

      const el = ref.current;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const sectionHeight = el.offsetHeight;
      const scrollable = Math.max(sectionHeight - viewportHeight, 1);

      const raw = -rect.top / scrollable;
      const progress = Math.max(0, Math.min(1, raw));
      const active = rect.top <= 0 && rect.bottom >= viewportHeight;

      setState({ progress, active });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return state;
}

function getFade(progress, start, fadeInEnd, holdEnd, fadeOutEnd) {
  if (progress <= start) return 0;
  if (progress < fadeInEnd) return (progress - start) / (fadeInEnd - start);
  if (progress < holdEnd) return 1;
  if (progress < fadeOutEnd) {
    return 1 - (progress - holdEnd) / (fadeOutEnd - holdEnd);
  }
  return 0;
}

/* ---------------- TYPOGRAPHY ---------------- */

function Headline({ children, style = {} }) {
  return (
    <div
      style={{
        fontSize: "clamp(2.6rem, 7vw, 6rem)",
        lineHeight: 1.08,
        fontWeight: 700,
        fontFamily: '"Playfair Display", serif',
        color: "#fff",
        textAlign: "center",
        whiteSpace: "pre-line",
        margin: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function BodyLine({ children, style = {} }) {
  return (
    <div
      style={{
        fontSize: "clamp(1.15rem, 2.4vw, 1.9rem)",
        lineHeight: 1.45,
        fontWeight: 300,
        fontFamily: '"Inter", sans-serif',
        color: "rgba(255,255,255,0.88)",
        textAlign: "center",
        whiteSpace: "pre-line",
        margin: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- CARET ---------------- */

function ScrollCue({ visible = true }) {
  const [blinkOn, setBlinkOn] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const interval = window.setInterval(() => {
      setBlinkOn((v) => !v);
    }, 850);
    return () => window.clearInterval(interval);
  }, [visible]);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: "44px",
        transform: "translateX(-50%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
        textAlign: "center",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <div
        style={{
          fontSize: "24px",
          lineHeight: 1,
          color: "rgba(255,255,255,0.72)",
          opacity: blinkOn ? 0.85 : 0.2,
          transition: "opacity 0.35s ease",
        }}
      >
        ⌄
      </div>
    </div>
  );
}

/* ---------------- INTRO ---------------- */

function IntroAutoScene() {
  const [step, setStep] = useState(0);
  const [showCue, setShowCue] = useState(false);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep(1), 450),
      window.setTimeout(() => setStep(2), 1700),
      window.setTimeout(() => setStep(3), 3000),
      window.setTimeout(() => setShowCue(true), 4300),
    ];

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "170vh", background: "#000" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#000",
          padding: "2rem",
        }}
      >
        <div style={{ width: "min(1100px, calc(100vw - 48px))", textAlign: "center" }}>
          <div style={{ opacity: step >= 1 ? 1 : 0, transition: "opacity 1.3s ease" }}>
            <Headline>You’re tired.</Headline>
          </div>

          <div
            style={{
              opacity: step >= 2 ? 1 : 0,
              transition: "opacity 1.3s ease",
              marginTop: "18px",
            }}
          >
            <BodyLine>Not just physically.</BodyLine>
          </div>

          <div
            style={{
              opacity: step >= 3 ? 1 : 0,
              transition: "opacity 1.3s ease",
              marginTop: "10px",
            }}
          >
            <BodyLine style={{ color: "rgba(255,255,255,0.72)" }}>
              Deep-down tired.
            </BodyLine>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "72px",
            transform: "translateX(-50%)",
            opacity: showCue ? 0.72 : 0,
            transition: "opacity 0.8s ease",
            fontFamily: '"Inter", sans-serif',
            fontSize: "11px",
            fontWeight: 300,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.72)",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          Continuous Scroll
        </div>
        <ScrollCue visible={showCue} />
      </div>
    </section>
  );
}

/* ---------------- EARLY SECTIONS ---------------- */

function PushSequenceScene({ height = "520vh" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const firstOpacity = getFade(progress, 0, 0.14, 0.54, 0.7);
  const secondOpacity = getFade(progress, 0.26, 0.38, 0.66, 0.82);
  const thirdOpacity = getFade(progress, 0.44, 0.56, 0.8, 0.94);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ opacity: firstOpacity, transition: "opacity 0.12s linear" }}>
              <Headline>You keep pushing.</Headline>
            </div>

            <div
              style={{
                marginTop: "22px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ opacity: secondOpacity, transition: "opacity 0.12s linear" }}>
                <BodyLine>Longer hours.</BodyLine>
              </div>

              <div style={{ opacity: thirdOpacity, transition: "opacity 0.12s linear" }}>
                <BodyLine style={{ color: "rgba(255,255,255,0.76)" }}>
                  More pressure.
                </BodyLine>
              </div>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

function TwoLineSequenceScene({
  first,
  second,
  height = "520vh",
  secondAsBody = true,
}) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const firstOpacity = getFade(progress, 0, 0.18, 0.62, 0.8);
  const secondOpacity = getFade(progress, 0.42, 0.56, 0.82, 0.96);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ opacity: firstOpacity, transition: "opacity 0.12s linear" }}>
              <Headline>{first}</Headline>
            </div>

            <div
              style={{
                marginTop: "22px",
                opacity: secondOpacity,
                transition: "opacity 0.12s linear",
              }}
            >
              {secondAsBody ? (
                <BodyLine>{second}</BodyLine>
              ) : (
                <Headline style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                  {second}
                </Headline>
              )}
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

function QuadSequenceScene({ height = "620vh" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const firstOpacity = getFade(progress, 0, 0.12, 0.22, 0.3);
  const secondOpacity = getFade(progress, 0.24, 0.34, 0.46, 0.56);
  const thirdOpacity = getFade(progress, 0.5, 0.62, 0.76, 0.86);
  const fourthOpacity = getFade(progress, 0.78, 0.88, 0.97, 1);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "left",
            }}
          >
            <div style={{ opacity: firstOpacity, transition: "opacity 0.12s linear" }}>
              <Headline style={{ textAlign: "left" }}>Work.</Headline>
            </div>

            <div style={{ marginTop: "16px", opacity: secondOpacity, transition: "opacity 0.12s linear" }}>
              <Headline style={{ textAlign: "left" }}>Stress.</Headline>
            </div>

            <div style={{ marginTop: "16px", opacity: thirdOpacity, transition: "opacity 0.12s linear" }}>
              <Headline style={{ textAlign: "left" }}>Expectations.</Headline>
            </div>

            <div style={{ marginTop: "16px", opacity: fourthOpacity, transition: "opacity 0.12s linear" }}>
              <Headline style={{ textAlign: "left" }}>Repeat.</Headline>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

function StackedSequenceScene({ height = "520vh" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const firstOpacity = getFade(progress, 0, 0.16, 0.42, 0.54);
  const secondOpacity = getFade(progress, 0.38, 0.6, 0.76, 0.86);
  const thirdOpacity = getFade(progress, 0.68, 0.88, 0.97, 1);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ opacity: firstOpacity, transition: "opacity 0.12s linear" }}>
              <Headline>You tell yourself</Headline>
            </div>

            <div style={{ marginTop: "18px", opacity: secondOpacity, transition: "opacity 0.12s linear" }}>
              <Headline style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}>
                It’ll slow down soon
              </Headline>
            </div>

            <div style={{ marginTop: "22px", opacity: thirdOpacity, transition: "opacity 0.12s linear" }}>
              <BodyLine style={{ color: "rgba(255,255,255,0.78)" }}>
                That peace is on the other side
              </BodyLine>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}
function ReliefVideoScene({ height = "640vh", src = "/videos/1.mp4" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const pageOpacity = getFade(progress, 0.06, 0.18, 0.88, 0.98);
  const secondLineOpacity = getFade(progress, 0.42, 0.56, 0.9, 1);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        height,
        background: "#000",
      }}
    >
      {active && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6vw",
              gap: "6vw",
              opacity: pageOpacity,
              transition: "opacity 0.12s linear",
            }}
          >
            <div
              style={{
                flex: 1,
                maxWidth: "560px",
              }}
            >
              <Headline style={{ textAlign: "left" }}>
                Sure, there
                <br />
                are moments
                <br />
                of relief.
              </Headline>

              <div
                style={{
                  marginTop: "20px",
                  opacity: secondLineOpacity,
                  transition: "opacity 0.12s linear",
                }}
              >
                <BodyLine style={{ textAlign: "left" }}>
                  But they never last.
                </BodyLine>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  height: "auto",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}
function NextLevelScene({ height = "520vh" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const firstOpacity = getFade(progress, 0, 0.18, 0.5, 0.68);
  const secondOpacity = getFade(progress, 0.42, 0.58, 0.86, 1);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        height,
        background: "#000",
      }}
    >
      {active && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                opacity: firstOpacity,
                transition: "opacity 0.12s linear",
              }}
            >
              <Headline>Even at the next level</Headline>
            </div>

            <div
              style={{
                marginTop: "22px",
                opacity: secondOpacity,
                transition: "opacity 0.12s linear",
              }}
            >
              <BodyLine>Peace remains just out of reach.</BodyLine>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

/* ---------------- MID ARC ---------------- */

function ReflectVideoScene({ height = "700vh", src = "/videos/2.mp4" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const pageOpacity = getFade(progress, 0, 0.18, 0.62, 0.8);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6vw",
              gap: "6vw",
              opacity: pageOpacity,
              transition: "opacity 0.12s linear",
            }}
          >
            <div style={{ flex: 1, maxWidth: "600px" }}>
              <Headline style={{ textAlign: "left" }}>
                And if you’re honest,
              </Headline>

              <div style={{ marginTop: "18px" }}>
                <BodyLine style={{ textAlign: "left" }}>
                  it’s hard to remember
                  <br />
                  what peace feels like anymore.
                </BodyLine>
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "6px",
                  display: "block",
                }}
              />
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

function KeepGoingScene({ height = "520vh" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const firstOpacity = getFade(progress, 0, 0.18, 0.55, 0.72);
  const secondOpacity = getFade(progress, 0.38, 0.6, 0.82, 0.96);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10 }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ opacity: firstOpacity, transition: "opacity 0.12s linear" }}>
              <Headline>So you keep going</Headline>
            </div>

            <div style={{ marginTop: "22px", opacity: secondOpacity, transition: "opacity 0.12s linear" }}>
              <BodyLine>because stopping feels worse.</BodyLine>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

function CrackVideoScene({ height = "700vh", src = "/videos/4.mp4" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const sharedOpacity = getFade(progress, 0.08, 0.18, 0.9, 0.98);
  const secondOpacity = getFade(progress, 0.3, 0.5, 0.78, 0.9);
  const thirdOpacity = getFade(progress, 0.58, 0.74, 0.94, 1);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6vw",
              gap: "6vw",
              opacity: sharedOpacity,
              transition: "opacity 0.12s linear",
            }}
          >
            <div style={{ flex: 1, maxWidth: "600px" }}>
              <Headline style={{ textAlign: "left" }}>
                Until something cracks
              </Headline>

              <div style={{ marginTop: "18px", opacity: secondOpacity, transition: "opacity 0.12s linear" }}>
                <BodyLine style={{ textAlign: "left" }}>
                  and everything you were holding together
                </BodyLine>
              </div>

              <div style={{ marginTop: "18px", opacity: thirdOpacity, transition: "opacity 0.12s linear" }}>
                <BodyLine style={{ textAlign: "left", color: "rgba(255,255,255,0.75)" }}>
                  breaks.
                </BodyLine>
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "6px",
                  display: "block",
                }}
              />
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

function RockBottomScene({ height = "520vh" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const firstBlockOpacity = getFade(progress, 0, 0.18, 0.52, 0.68);
  const secondLineOpacity = getFade(progress, 0.48, 0.64, 0.88, 1);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ opacity: firstBlockOpacity, transition: "opacity 0.12s linear" }}>
              <Headline>It&apos;s easy to pray when</Headline>
              <Headline style={{ marginTop: "8px" }}>you are at rock bottom</Headline>
            </div>

            <div style={{ marginTop: "22px", opacity: secondLineOpacity, transition: "opacity 0.12s linear" }}>
              <BodyLine>But harder to know what to say</BodyLine>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

function FarGoneVideoScene({ height = "700vh", src = "/videos/3.mp4" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const sharedOpacity = getFade(progress, 0.08, 0.18, 0.9, 0.98);
  const secondOpacity = getFade(progress, 0.42, 0.58, 0.86, 1);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6vw",
              gap: "6vw",
              opacity: sharedOpacity,
              transition: "opacity 0.12s linear",
            }}
          >
            <div style={{ flex: 1, maxWidth: "600px" }}>
              <Headline style={{ textAlign: "left" }}>
                Especially when you feel so far gone...
              </Headline>

              <div style={{ marginTop: "22px", opacity: secondOpacity, transition: "opacity 0.12s linear" }}>
                <BodyLine style={{ textAlign: "left" }}>
                  That you don&apos;t know how to come back
                </BodyLine>
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "6px",
                  display: "block",
                }}
              />
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}
function JesusFitScene({ height = "520vh" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const firstOpacity = getFade(progress, 0, 0.18, 0.58, 0.74);
  const secondOpacity = getFade(progress, 0.44, 0.6, 0.86, 1);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        height,
        background: "#000",
      }}
    >
      {active && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                opacity: firstOpacity,
                transition: "opacity 0.12s linear",
              }}
            >
              <Headline>But Jesus never asked</Headline>
            </div>

            <div
              style={{
                marginTop: "22px",
                opacity: secondOpacity,
                transition: "opacity 0.12s linear",
              }}
            >
              <BodyLine>people to fit first.</BodyLine>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}
function MetPeopleVideoScene({ height = "900vh", src = "/videos/5.mp4" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const sharedOpacity = getFade(progress, 0.08, 0.18, 0.94, 0.99);
  const line2FirstOpacity = getFade(progress, 0.26, 0.34, 0.94, 0.99);
  const line2SecondOpacity = getFade(progress, 0.34, 0.42, 0.94, 0.99);
  const finalOpacity = getFade(progress, 0.58, 0.68, 0.97, 1);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6vw",
              gap: "6vw",
              opacity: sharedOpacity,
              transition: "opacity 0.12s linear",
            }}
          >
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "6px",
                  display: "block",
                }}
              />
            </div>

            <div style={{ flex: 1, maxWidth: "700px" }}>
              <Headline style={{ textAlign: "left" }}>
                He met people exactly where they were
              </Headline>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  justifyContent: "flex-start",
                }}
              >
                <div style={{ opacity: line2FirstOpacity, transition: "opacity 0.12s linear" }}>
                  <BodyLine style={{ textAlign: "left" }}>Not cleaned up.</BodyLine>
                </div>

                <div style={{ opacity: line2SecondOpacity, transition: "opacity 0.12s linear" }}>
                  <BodyLine style={{ textAlign: "left" }}>Not figured out.</BodyLine>
                </div>
              </div>

              <div style={{ marginTop: "22px", opacity: finalOpacity, transition: "opacity 0.12s linear" }}>
                <BodyLine style={{ textAlign: "left", color: "rgba(255,255,255,0.74)" }}>
                  Just... there.
                </BodyLine>
              </div>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

function NeededVideoScene({ height = "700vh", src = "/videos/6.mp4" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const sharedOpacity = getFade(progress, 0.08, 0.18, 0.92, 0.98);
  const secondOpacity = getFade(progress, 0.5, 0.64, 0.92, 1);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6vw",
              gap: "6vw",
              opacity: sharedOpacity,
              transition: "opacity 0.12s linear",
            }}
          >
            <div style={{ flex: 1, maxWidth: "600px" }}>
              <Headline style={{ textAlign: "left" }}>
                Not because they earned it.
              </Headline>

              <div style={{ marginTop: "22px", opacity: secondOpacity, transition: "opacity 0.12s linear" }}>
                <BodyLine style={{ textAlign: "left" }}>
                  But because they needed it.
                </BodyLine>
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "6px",
                  display: "block",
                }}
              />
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}
function BelongScene({ height = "520vh" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const firstOpacity = getFade(progress, 0, 0.18, 0.56, 0.74);
  const secondOpacity = getFade(progress, 0.42, 0.6, 0.86, 1);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        height,
        background: "#000",
      }}
    >
      {active && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            {/* Line 1 */}
            <div
              style={{
                opacity: firstOpacity,
                transition: "opacity 0.12s linear",
              }}
            >
              <Headline>
                The ones who didn&apos;t belong...
              </Headline>
            </div>

            {/* Line 2 */}
            <div
              style={{
                marginTop: "22px",
                opacity: secondOpacity,
                transition: "opacity 0.12s linear",
              }}
            >
              <BodyLine style={{ color: "#fff" }}>
                were the ones He usually sat with.
              </BodyLine>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}
function SawInYouScene({ height = "520vh" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const firstOpacity = getFade(progress, 0, 0.18, 0.62, 0.8);
  const secondOpacity = getFade(progress, 0.44, 0.58, 0.84, 1);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ opacity: firstOpacity, transition: "opacity 0.12s linear" }}>
              <Headline>And because he<br></br> saw in them</Headline>
            </div>

            <div style={{ marginTop: "22px", opacity: secondOpacity, transition: "opacity 0.12s linear" }}>
              <BodyLine>the same thing he sees in you.</BodyLine>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

function HeavenScene({ height = "520vh" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  // Fade IN (staggered)
  const line1In = Math.min(Math.max(progress / 0.18, 0), 1);
  const line2In = Math.min(Math.max((progress - 0.18) / 0.18, 0), 1);
  const line3In = Math.min(Math.max((progress - 0.36) / 0.18, 0), 1);

  // Shared fade OUT (all together)
  const fadeOut = 1 - Math.min(Math.max((progress - 0.72) / 0.18, 0), 1);

  const line1Opacity = line1In * fadeOut;
  const line2Opacity = line2In * fadeOut;
  const line3Opacity = line3In * fadeOut;

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10 }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ opacity: line1Opacity, transition: "opacity 0.12s linear" }}>
              <Headline>Heaven wouldn't</Headline>
            </div>

            <div style={{ marginTop: "16px", opacity: line2Opacity, transition: "opacity 0.12s linear" }}>
              <Headline>be the same</Headline>
            </div>

            <div style={{ marginTop: "16px", opacity: line3Opacity, transition: "opacity 0.12s linear" }}>
              <BodyLine>without you.</BodyLine>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

function BecomeScene({ height = "640vh" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const firstOpacity = getFade(progress, 0, 0.18, 0.4, 0.52);
  const secondOpacity = getFade(progress, 0.32, 0.5, 0.74, 0.86);
  const thirdOpacity = getFade(progress, 0.68, 0.84, 0.97, 1);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ opacity: firstOpacity, transition: "opacity 0.12s linear" }}>
              <Headline>Not the version of you</Headline>
            </div>

            <div style={{ marginTop: "18px", opacity: secondOpacity, transition: "opacity 0.12s linear" }}>
              <BodyLine>you think you need to become.</BodyLine>
            </div>

            <div style={{ marginTop: "22px", opacity: thirdOpacity, transition: "opacity 0.12s linear" }}>
              <BodyLine style={{ fontWeight: 700, color: "#fff" }}>You.</BodyLine>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

function MeetsYouScene({ height = "520vh" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const firstOpacity = getFade(progress, 0, 0.18, 0.62, 0.8);
  const secondOpacity = getFade(progress, 0.44, 0.58, 0.84, 1);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ opacity: firstOpacity, transition: "opacity 0.12s linear" }}>
              <Headline>He meets you <br></br>where you are.</Headline>
            </div>

            <div style={{ marginTop: "22px", opacity: secondOpacity, transition: "opacity 0.12s linear" }}>
              <BodyLine>And helps your put the pieces back together.</BodyLine>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

function HearsYouScene({ height = "640vh" }) {
  const ref = useRef(null);
  const { progress, active } = useSectionState(ref);

  const firstOpacity = getFade(progress, 0, 0.18, 0.36, 0.48);
  const secondOpacity = getFade(progress, 0.28, 0.46, 0.66, 0.78);
  const thirdOpacity = getFade(progress, 0.58, 0.76, 0.94, 1);

  return (
    <section ref={ref} style={{ position: "relative", height, background: "#000" }}>
      {active && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 10, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ opacity: firstOpacity, transition: "opacity 0.12s linear" }}>
              <Headline>He hears you.</Headline>
            </div>

            <div style={{ marginTop: "16px", opacity: secondOpacity, transition: "opacity 0.12s linear" }}>
              <BodyLine>You were never forgotten</BodyLine>
            </div>

            <div style={{ marginTop: "16px", opacity: thirdOpacity, transition: "opacity 0.12s linear" }}>
              <BodyLine>Your struggle was never unseen.</BodyLine>
            </div>
          </div>

          <ScrollCue visible />
        </div>
      )}
    </section>
  );
}

function FinalCallScene({ height = "820vh" }) {
  const ref = useRef(null);
  const { progress } = useSectionState(ref);
  const [active, setActive] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [discographyOpen, setDiscographyOpen] = useState(false);

  useEffect(() => {
    function updateActive() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setActive(rect.top <= 0 && rect.bottom > 0);
    }

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  const firstOpacity = Math.min(Math.max(progress / 0.18, 0), 1);
  const secondOpacity = Math.min(Math.max((progress - 0.3) / 0.18, 0), 1);
  const thirdOpacity = Math.min(Math.max((progress - 0.62) / 0.16, 0), 1);

  useEffect(() => {
    if (!active || thirdOpacity < 0.999) {
      setShowFooter(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowFooter(true);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [active, thirdOpacity]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        height,
        background: "#000",
      }}
    >
      {active && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              width: "min(1100px, calc(100vw - 48px))",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div style={{ opacity: firstOpacity, transition: "opacity 0.12s linear" }}>
              <Headline>He is calling.</Headline>
            </div>

            <div
              style={{
                marginTop: "16px",
                opacity: secondOpacity,
                transition: "opacity 0.12s linear",
              }}
            >
              <BodyLine>And all you need to do...</BodyLine>
            </div>

            <div
              style={{
                marginTop: "18px",
                opacity: thirdOpacity,
                transition: "opacity 0.12s linear",
              }}
            >
              <BodyLine style={{ color: "#fff", fontSize: "clamp(1.3rem, 2.8vw, 2.2rem)" }}>
                is talk.
              </BodyLine>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: discographyOpen ? "28px" : "56px",
              transform: "translateX(-50%)",
              width: "min(1280px, calc(100vw - 48px))",
              opacity: showFooter ? 1 : 0,
              transition: "opacity 1.2s ease, bottom 0.4s ease",
              textAlign: "center",
              pointerEvents: showFooter ? "auto" : "none",
            }}
          >
            <div
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: "12px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.72)",
                marginBottom: "12px",
              }}
            >
              TALK BY ECHOES OF ASAPH
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "14px",
                fontFamily: '"Inter", sans-serif',
                fontSize: "13px",
                color: "#fff",
                marginBottom: discographyOpen ? "22px" : "0",
              }}
            >
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.9)",
                  cursor: "pointer",
                  fontFamily: '"Inter", sans-serif',
                  fontSize: "13px",
                }}
              >
                Back to top
              </button>

              <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>

              <button
                onClick={() => setDiscographyOpen((v) => !v)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.9)",
                  cursor: "pointer",
                  fontFamily: '"Inter", sans-serif',
                  fontSize: "13px",
                }}
              >
                {discographyOpen ? "Hide Discography" : "Discography"}
              </button>
            </div>

            <div
              style={{
                maxHeight: discographyOpen ? "420px" : "0px",
                opacity: discographyOpen ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.45s ease, opacity 0.35s ease",
              }}
            >
              <div
                style={{
                  marginTop: "-10px",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <iframe
                  data-testid="embed-iframe"
                  style={{ borderRadius: "12px" }}
                  src="https://open.spotify.com/embed/artist/5V8zgTKvLMnOKHZrbE63rp?utm_source=generator&theme=0"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Echoes of Asaph Discography"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------------- APP ---------------- */

export default function App() {
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <IntroAutoScene />

      <PushSequenceScene height="520vh" />

      <TwoLineSequenceScene
        height="520vh"
        first="The next level feels..."
        second="So close."
        secondAsBody={true}
      />

      <QuadSequenceScene height="620vh" />

      <StackedSequenceScene height="520vh" />
      <ReliefVideoScene height="640vh" src="/videos/1.mp4" />

      <NextLevelScene height="520vh" />

      <ReflectVideoScene height="700vh" src="/videos/2.mp4" />

      <KeepGoingScene height="520vh" />

      <CrackVideoScene height="700vh" src="/videos/4.mp4" />

      <RockBottomScene height="520vh" />

      <FarGoneVideoScene height="700vh" src="/videos/3.mp4" />
      <JesusFitScene height="520vh" />
      <MetPeopleVideoScene height="900vh" src="/videos/5.mp4" />
      <BelongScene height="520vh" />
      <NeededVideoScene height="700vh" src="/videos/6.mp4" />

      <SawInYouScene height="520vh" />

      <HeavenScene height="620vh" />

      <BecomeScene height="640vh" />

      <MeetsYouScene height="520vh" />

      <HearsYouScene height="640vh" />

      <FinalCallScene height="520vh" />
    </div>
  );
}