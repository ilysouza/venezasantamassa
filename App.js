
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import {
  loginUser,
  registerUser,
} from "./src/services/authService";

import MainApp from "./src/screens/MainApp";

const COLORS = {
  red: "#C62828",
  darkRed: "#981B1B",
  orange: "#FF8A24",
  cream: "#FFF8F0",
  white: "#FFFFFF",
  text: "#302522",
  muted: "#8B7D77",
  border: "#EDE2DA",
  green: "#287A46",
};

const PIZZA_IMAGE =
  "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=85";

export default function App() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 850;

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [enteredApp, setEnteredApp] = useState(false);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(14)).current;

  const isLogin = mode === "login";

  useEffect(() => {
    fade.setValue(0);
    slide.setValue(14);

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mode, fade, slide]);

  function changeMode(nextMode) {
    setMode(nextMode);
    setFeedback(null);
    setPassword("");
  }

  function validateForm() {
    if (!isLogin && !name.trim()) {
      setFeedback({
        type: "error",
        text: "Digite seu nome para continuar.",
      });
      return false;
    }

    const normalizedEmail = email.trim();

    if (
      !normalizedEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      setFeedback({
        type: "error",
        text: "Digite um endereço de e-mail válido.",
      });
      return false;
    }

    if (!password) {
      setFeedback({
        type: "error",
        text: "Digite sua senha.",
      });
      return false;
    }

    if (!isLogin && password.length < 8) {
      setFeedback({
        type: "error",
        text: "Sua senha precisa ter pelo menos 8 caracteres.",
      });
      return false;
    }

    if (!isLogin && !acceptedTerms) {
      setFeedback({
        type: "error",
        text: "Aceite os termos para continuar.",
      });
      return false;
    }

    return true;
  }

  
async function handleSubmit() {
  setFeedback(null);

  if (!validateForm()) return;

  setLoading(true);

  try {
    const result = isLogin
      ? await loginUser({ email, password })
      : await registerUser({ name, email, password });

    if (result.ok && isLogin) {
      setEnteredApp(true);
      return;
    }

    setFeedback({
      type: result.ok ? "success" : "error",
      text: result.message,
    });

    if (result.ok && !isLogin) {
      setName("");
      setPassword("");
      setAcceptedTerms(false);
    }
  } catch (error) {
    setFeedback({
      type: "error",
      text: "Não foi possível concluir. Tente novamente.",
    });
  } finally {
    setLoading(false);
  }
}


  if (enteredApp) {
    return <MainApp />;
  }

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop && styles.desktopContent,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.layout,
              isDesktop && styles.desktopLayout,
            ]}
          >
            {/* Painel visual */}
            <View
              style={[
                styles.hero,
                isDesktop && styles.desktopHero,
              ]}
            >
              <ImageBackground
                source={{ uri: PIZZA_IMAGE }}
                resizeMode="cover"
                style={styles.heroImage}
                imageStyle={styles.heroImageRadius}
              >
                <View style={styles.heroOverlay} />

                <View style={styles.heroContent}>
                  <View style={styles.brandMark}>
                    <Text style={styles.brandEmoji}>🍕</Text>
                  </View>

                  <Text style={styles.brandName}>
                    VENEZA{"\n"}SANTA MASSA
                  </Text>

                  <View style={styles.orangeLine} />

                  <Text style={styles.heroTitle}>
                    O sabor que{"\n"}reúne você.
                  </Text>

                  <Text style={styles.heroDescription}>
                    Sua pizza favorita, feita com carinho
                    e pronta para deixar seu dia mais gostoso.
                  </Text>

                  <View style={styles.heroTag}>
                    <Text style={styles.heroTagText}>
                      ✦  FEITO COM AMOR E MUITA MASSA
                    </Text>
                  </View>
                </View>

                <Text style={styles.heroFooter}>
                  SUA PRÓXIMA PIZZA COMEÇA AQUI
                </Text>
              </ImageBackground>
            </View>

            {/* Formulário */}
            <Animated.View
              style={[
                styles.formPanel,
                isDesktop && styles.desktopFormPanel,
                {
                  opacity: fade,
                  transform: [{ translateY: slide }],
                },
              ]}
            >
              <View style={styles.mobileBrand}>
                <Text style={styles.mobileBrandEmoji}>🍕</Text>
                <Text style={styles.mobileBrandName}>
                  Veneza Santa Massa
                </Text>
              </View>

              <View style={styles.heading}>
                <Text style={styles.eyebrow}>
                  {isLogin ? "QUE BOM TER VOCÊ AQUI!" : "FAÇA PARTE DA FAMÍLIA"}
                </Text>

                <Text style={styles.title}>
                  {isLogin ? "Bem-vindo!" : "Crie sua conta"}
                </Text>

                <Text style={styles.subtitle}>
                  {isLogin
                    ? "Entre para pedir suas pizzas favoritas."
                    : "Cadastre-se e prepare-se para saborear."}
                </Text>
              </View>

              {/* Alternância de telas */}
              <View style={styles.tabs}>
                <Pressable
                  onPress={() => changeMode("login")}
                  style={[
                    styles.tab,
                    isLogin && styles.activeTab,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isLogin && styles.activeTabText,
                    ]}
                  >
                    Entrar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => changeMode("register")}
                  style={[
                    styles.tab,
                    !isLogin && styles.activeTab,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      !isLogin && styles.activeTabText,
                    ]}
                  >
                    Criar conta
                  </Text>
                </Pressable>
              </View>

              {!isLogin && (
                <View style={styles.field}>
                  <Text style={styles.label}>Nome completo</Text>

                  <View style={styles.inputWrap}>
                    <Text style={styles.inputIcon}>👤</Text>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="Como podemos te chamar?"
                      placeholderTextColor={COLORS.muted}
                      autoCapitalize="words"
                      autoComplete="name"
                      returnKeyType="next"
                      style={styles.input}
                    />
                  </View>
                </View>
              )}

              <View style={styles.field}>
                <Text style={styles.label}>E-mail</Text>

                <View style={styles.inputWrap}>
                  <Text style={styles.inputIcon}>✉</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="voce@exemplo.com"
                    placeholderTextColor={COLORS.muted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    returnKeyType="next"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <View style={styles.passwordLabelRow}>
                  <Text style={styles.label}>Senha</Text>

                  {isLogin && (
                    <Pressable
                      onPress={() =>
                        setFeedback({
                          type: "info",
                          text: "A recuperação de senha será implementada com o backend.",
                        })
                      }
                    >
                      <Text style={styles.forgotText}>
                        Esqueceu a senha?
                      </Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.inputWrap}>
                  <Text style={styles.inputIcon}>🔒</Text>

                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder={
                      isLogin ? "Digite sua senha" : "Mínimo de 8 caracteres"
                    }
                    placeholderTextColor={COLORS.muted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete={
                      isLogin ? "current-password" : "new-password"
                    }
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    style={styles.input}
                  />

                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    accessibilityLabel={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    style={styles.showPassword}
                  >
                    <Text style={styles.showPasswordText}>
                      {showPassword ? "Ocultar" : "Ver"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {!isLogin && (
                <Pressable
                  style={styles.termsRow}
                  onPress={() => setAcceptedTerms(!acceptedTerms)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      acceptedTerms && styles.checkedBox,
                    ]}
                  >
                    {acceptedTerms && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>

                  <Text style={styles.termsText}>
                    Li e aceito os termos de uso e a política de privacidade.
                  </Text>
                </Pressable>
              )}

              {feedback && (
                <View
                  accessibilityLiveRegion="polite"
                  style={[
                    styles.feedback,
                    feedback.type === "success" && styles.successFeedback,
                    feedback.type === "error" && styles.errorFeedback,
                    feedback.type === "info" && styles.infoFeedback,
                  ]}
                >
                  <Text style={styles.feedbackText}>
                    {feedback.text}
                  </Text>
                </View>
              )}

              <Pressable
                disabled={loading}
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.buttonPressed,
                  loading && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.submitButtonText}>
                  {loading
                    ? "Aguarde..."
                    : isLogin
                      ? "Entrar na minha conta  →"
                      : "Criar minha conta  →"}
                </Text>
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>SIMPLES ASSIM</Text>
                <View style={styles.dividerLine} />
              </View>

              <Text style={styles.bottomText}>
                {isLogin
                  ? "Ainda não tem uma conta?"
                  : "Já tem uma conta?"}{" "}
                <Text
                  onPress={() =>
                    changeMode(isLogin ? "register" : "login")
                  }
                  style={styles.bottomLink}
                >
                  {isLogin ? "Cadastre-se" : "Entre aqui"}
                </Text>
              </Text>

              <View style={styles.trustRow}>
                <Text style={styles.trustText}>
                  🍕  Feito para quem ama pizza
                </Text>
              </View>
            </Animated.View>
          </View>

          <Text style={styles.pageFooter}>
            VENEZA SANTA MASSA © 2026 · FEITO COM ❤️
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 18,
    justifyContent: "center",
  },
  desktopContent: {
    paddingVertical: 36,
    paddingHorizontal: 28,
  },
  layout: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    backgroundColor: COLORS.white,
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#5A271B",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.09,
    shadowRadius: 28,
    elevation: 5,
  },
  desktopLayout: {
    maxWidth: 1080,
    flexDirection: "row",
    minHeight: 660,
  },
  hero: {
    minHeight: 420,
    backgroundColor: COLORS.darkRed,
    overflow: "hidden",
  },
  desktopHero: {
    width: "44%",
    minHeight: 660,
    flexGrow: 1,
  },
  heroImage: {
    flex: 1,
    minHeight: 420,
    justifyContent: "space-between",
    padding: 28,
  },
  heroImageRadius: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(75, 13, 8, 0.70)",
  },
  heroContent: {
    alignItems: "flex-start",
  },
  brandMark: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  brandEmoji: {
    fontSize: 28,
  },
  brandName: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 1.3,
    lineHeight: 28,
  },
  orangeLine: {
    height: 4,
    width: 48,
    borderRadius: 5,
    backgroundColor: COLORS.orange,
    marginTop: 16,
    marginBottom: 18,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: "800",
    lineHeight: 33,
  },
  heroDescription: {
    color: "#FFF1E6",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 330,
  },
  heroTag: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 30,
    marginTop: 18,
  },
  heroTagText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  heroFooter: {
    color: "#FFE2C9",
    fontSize: 9,
    letterSpacing: 1.3,
    fontWeight: "800",
  },
  formPanel: {
    padding: 25,
    paddingTop: 28,
    backgroundColor: COLORS.white,
  },
  desktopFormPanel: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 42,
    paddingVertical: 40,
  },
  mobileBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 25,
  },
  mobileBrandEmoji: {
    fontSize: 25,
  },
  mobileBrandName: {
    color: COLORS.red,
    fontSize: 16,
    fontWeight: "900",
  },
  heading: {
    marginBottom: 23,
  },
  eyebrow: {
    color: COLORS.red,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 9,
  },
  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#F7F1EC",
    borderRadius: 12,
    padding: 4,
    marginBottom: 23,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 9,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  tabText: {
    color: COLORS.muted,
    fontWeight: "700",
    fontSize: 13,
  },
  activeTabText: {
    color: COLORS.red,
  },
  field: {
    marginBottom: 17,
  },
  label: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 8,
  },
  inputWrap: {
    minHeight: 51,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FFFCFA",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
    color: COLORS.muted,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: COLORS.text,
    fontSize: 13,
    paddingVertical: 13,
    outlineStyle: "none",
  },
  passwordLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  forgotText: {
    color: COLORS.red,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
  },
  showPassword: {
    paddingVertical: 10,
    paddingLeft: 8,
  },
  showPasswordText: {
    color: COLORS.red,
    fontWeight: "700",
    fontSize: 11,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 18,
  },
  checkbox: {
    width: 19,
    height: 19,
    borderWidth: 1,
    borderColor: "#CDBBB0",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "900",
  },
  termsText: {
    flex: 1,
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
  },
  feedback: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#F4F0EC",
  },
  successFeedback: {
    backgroundColor: "#EAF6ED",
  },
  errorFeedback: {
    backgroundColor: "#FFF0EE",
  },
  infoFeedback: {
    backgroundColor: "#FFF4E6",
  },
  feedbackText: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: COLORS.red,
    minHeight: 53,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    shadowColor: COLORS.red,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.19,
    shadowRadius: 9,
    elevation: 3,
  },
  buttonPressed: {
    backgroundColor: COLORS.darkRed,
    transform: [{ scale: 0.985 }],
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 13,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 22,
  },
  dividerLine: {
    height: 1,
    flex: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: "#A9978D",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  bottomText: {
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 12,
  },
  bottomLink: {
    color: COLORS.red,
    fontWeight: "900",
  },
  trustRow: {
    alignItems: "center",
    marginTop: 25,
  },
  trustText: {
    color: "#A9978D",
    fontSize: 10,
  },
  pageFooter: {
    textAlign: "center",
    marginTop: 18,
    marginBottom: 5,
    color: "#A9978D",
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: "700",
  },
});
