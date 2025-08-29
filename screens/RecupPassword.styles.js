import { StyleSheet } from "react-native";

export default StyleSheet.create({
  flex: { flex: 1 },

  // Centra el contenido (card) vertical y horizontalmente
  bg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },

  //Icono que me devuelve al login
  backButton: {
  position: "absolute",
  top: 30,
  left: 16,
  width: 55,
  height: 55,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10, // sobre el overlay
},
backIcon: {
  fontSize: 45,   // ajústalo a 40–60 si lo quieres más grande
  lineHeight: 30,
  color: "#fff",
},



  //Header fijo arriba para que no desplace al card
  header: {
    position: "absolute",
    top: 55,           // valor de tu margen original
    left: 0,
    right: 0,
    width: "100%",
    alignItems: "center",
    marginBottom: 0,
  },

  logo: { width: 230, height: 230 },

  brand: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: "600",
    color: "#EAF2FF",
    letterSpacing: 0.5,
  },

  // El card ya quedará centrado gracias al padre (bg)
  card: {
    width: "88%",
    backgroundColor: "rgba(47, 51, 61, 0.72)",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  cardTitle: {
    fontSize: 18,
    color: "#EAF2FF",
    fontWeight: "700",
    marginBottom: 6,
  },

  cardSubtitle: { fontSize: 13, color: "#B8C3D9", marginBottom: 18 },

  /* INPUT */
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 14, 22, 0.85)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(150, 160, 180, 0.25)",
    marginBottom: 14,
  },
  inputWrapperFocused: {
    borderColor: "#6CA5FF",
    shadowColor: "#6CA5FF",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  iconBox: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "rgba(150, 160, 180, 0.22)",
  },
  iconText: { fontSize: 18, color: "#D8E4FF" },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    color: "#EAF2FF",
    fontSize: 14,
  },

  /* BOTÓN */
  primaryBtn: {
    height: 46,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F80ED",
    marginTop: 6,
  },
  primaryBtnDisabled: {
    backgroundColor: "rgba(47,128,237,0.45)",
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  primaryBtnTextDisabled: {
    color: "rgba(255,255,255,0.7)",
  },
  pressed: { opacity: 0.85 },

  /* LINK */
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  loginHint: { color: "#A9B5CC", marginRight: 6, fontSize: 13 },
  loginLink: { color: "#6CA5FF", fontSize: 13, fontWeight: "700" },
  loginLinkPressed: { opacity: 0.7 },
});
