
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const COLORS = {
  red: "#C9232C",
  darkRed: "#971A21",
  orange: "#F28C28",
  cream: "#FFF8F0",
  white: "#FFFFFF",
  dark: "#292321",
  gray: "#77716D",
  lightGray: "#F0EBE6",
  green: "#23834D",
};

const PRODUCTS = [
  {
    id: "p1",
    name: "Calabresa Especial",
    description: "Calabresa, cebola e mussarela.",
    price: 39.9,
    category: "Salgadas",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900",
    popular: true,
  },
  {
    id: "p2",
    name: "Quatro Queijos",
    description: "Mussarela, provolone, parmesão e gorgonzola.",
    price: 45.9,
    category: "Salgadas",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900",
    popular: true,
  },
  {
    id: "p3",
    name: "Frango com Catupiry",
    description: "Frango temperado, catupiry e mussarela.",
    price: 43.9,
    category: "Salgadas",
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=900",
    popular: false,
  },
  {
    id: "p4",
    name: "Margherita",
    description: "Mussarela, tomate fresco e manjericão.",
    price: 38.9,
    category: "Salgadas",
    image:
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=900",
    popular: false,
  },
  {
    id: "p5",
    name: "Chocolate com Morango",
    description: "Chocolate cremoso e morangos.",
    price: 42.9,
    category: "Doces",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900",
    popular: true,
  },
  {
    id: "p6",
    name: "Banana com Canela",
    description: "Banana, açúcar e canela.",
    price: 35.9,
    category: "Doces",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900",
    popular: false,
  },
];

const SIZES = [
  { name: "Pequena", detail: "4 fatias", multiplier: 0.7 },
  { name: "Média", detail: "6 fatias", multiplier: 1 },
  { name: "Grande", detail: "8 fatias", multiplier: 1.3 },
  { name: "Família", detail: "12 fatias", multiplier: 1.6 },
];

const CRUSTS = [
  { name: "Tradicional", price: 0 },
  { name: "Catupiry", price: 7 },
  { name: "Cheddar", price: 7 },
  { name: "Chocolate", price: 9 },
];

const EXTRAS = [
  { name: "Mussarela extra", price: 5 },
  { name: "Bacon", price: 6 },
  { name: "Calabresa extra", price: 5 },
  { name: "Azeitona", price: 2.5 },
];

const CATEGORIES = ["Todas", "Salgadas", "Doces"];

function money(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function MainApp() {
  const { width } = useWindowDimensions();
  const wide = width >= 700;
  const [activeTab, setActiveTab] = useState("Início");
  const [category, setCategory] = useState("Todas");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("Média");
  const [selectedCrust, setSelectedCrust] = useState("Tradicional");
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedSize("Média");
      setSelectedCrust("Tradicional");
      setSelectedExtras([]);
      setQuantity(1);
    }
  }, [selectedProduct]);

  const visibleProducts = useMemo(() => {
    if (category === "Todas") return PRODUCTS;
    return PRODUCTS.filter((product) => product.category === category);
  }, [category]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  function calculatePrice(product, size, crust, extras) {
    const sizeOption = SIZES.find((item) => item.name === size);
    const crustOption = CRUSTS.find((item) => item.name === crust);

    const extrasPrice = extras.reduce((sum, extraName) => {
      const extra = EXTRAS.find((item) => item.name === extraName);
      return sum + (extra ? extra.price : 0);
    }, 0);

    return (
      product.price * (sizeOption ? sizeOption.multiplier : 1) +
      (crustOption ? crustOption.price : 0) +
      extrasPrice
    );
  }

  const customizationPrice = selectedProduct
    ? calculatePrice(
        selectedProduct,
        selectedSize,
        selectedCrust,
        selectedExtras
      )
    : 0;

  function toggleExtra(extraName) {
    setSelectedExtras((current) =>
      current.includes(extraName)
        ? current.filter((name) => name !== extraName)
        : [...current, extraName]
    );
  }

  function addToCart() {
    if (!selectedProduct) return;

    const item = {
      cartId: `${Date.now()}-${Math.random()}`,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      size: selectedSize,
      crust: selectedCrust,
      extras: [...selectedExtras],
      quantity,
      unitPrice: customizationPrice,
    };

    setCart((current) => [...current, item]);
    setSelectedProduct(null);
    setActiveTab("Sacola");

    Alert.alert(
      "Pizza adicionada! 🍕",
      `${item.name} foi adicionada à sua sacola.`
    );
  }

  function changeCartQuantity(cartId, change) {
    setCart((current) =>
      current
        .map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(cartId) {
    setCart((current) => current.filter((item) => item.cartId !== cartId));
  }

  function openProduct(product) {
    setSelectedProduct(product);
  }

  function ProductCard({ product }) {
    return (
      <View style={[styles.productCard, { width: wide ? 300 : "48%" }]}>
        <Pressable onPress={() => openProduct(product)}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          {product.popular && (
            <View style={styles.popularTag}>
              <Text style={styles.popularTagText}>⭐ Queridinha</Text>
            </View>
          )}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription} numberOfLines={2}>
              {product.description}
            </Text>
            <Text style={styles.productPrice}>{money(product.price)}</Text>
            <Text style={styles.customizeHint}>Preço inicial • Personalizar</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.addButton}
          onPress={() => openProduct(product)}
        >
          <Text style={styles.addButtonText}>+ Escolher pizza</Text>
        </Pressable>
      </View>
    );
  }

  function renderProducts(products) {
    if (products.length === 0) {
      return <Text style={styles.muted}>Nenhuma pizza nesta categoria.</Text>;
    }

    return (
      <View style={styles.productsGrid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>
    );
  }

  function renderHome() {
    return (
      <>
        <View style={styles.hero}>
          <View style={styles.heroText}>
            <Text style={styles.heroEyebrow}>FEITA COM CARINHO ❤️</Text>
            <Text style={styles.heroTitle}>Sua próxima pizza favorita!</Text>
            <Text style={styles.heroDescription}>
              Sabores especiais para deixar seu dia mais gostoso.
            </Text>
            <Pressable
              style={styles.heroButton}
              onPress={() => setActiveTab("Cardápio")}
            >
              <Text style={styles.heroButtonText}>Ver cardápio 🍕</Text>
            </Pressable>
          </View>
        </View>

        <SectionTitle title="As mais pedidas" subtitle="Favoritas da casa" />
        {renderProducts(PRODUCTS.filter((product) => product.popular))}

        <SectionTitle title="Escolha seu sabor" subtitle="Temos opções para todos" />
        <View style={styles.categoryGrid}>
          <Pressable
            style={styles.categoryCard}
            onPress={() => {
              setCategory("Salgadas");
              setActiveTab("Cardápio");
            }}
          >
            <Text style={styles.categoryEmoji}>🍕</Text>
            <Text style={styles.categoryName}>Pizzas salgadas</Text>
          </Pressable>
          <Pressable
            style={styles.categoryCard}
            onPress={() => {
              setCategory("Doces");
              setActiveTab("Cardápio");
            }}
          >
            <Text style={styles.categoryEmoji}>🍫</Text>
            <Text style={styles.categoryName}>Pizzas doces</Text>
          </Pressable>
        </View>
      </>
    );
  }

  function renderMenu() {
    return (
      <>
        <SectionTitle
          title="Nosso cardápio"
          subtitle="Escolha, personalize e aproveite!"
        />

        <View style={styles.categoryFilters}>
          {CATEGORIES.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[
                styles.filterButton,
                category === item && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  category === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        {renderProducts(visibleProducts)}
      </>
    );
  }

  function renderCart() {
    return (
      <>
        <SectionTitle
          title="Sua sacola"
          subtitle="Confira suas pizzas personalizadas"
        />

        {cart.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🛍️</Text>
            <Text style={styles.emptyTitle}>Sua sacola está vazia</Text>
            <Text style={styles.muted}>
              Escolha uma pizza no cardápio para começar!
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() => setActiveTab("Cardápio")}
            >
              <Text style={styles.primaryButtonText}>Ir para o cardápio</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {cart.map((item) => (
              <View key={item.cartId} style={styles.cartItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.cartImage}
                />
                <View style={styles.cartDetails}>
                  <Text style={styles.cartName}>{item.name}</Text>
                  <Text style={styles.cartOption}>Tamanho: {item.size}</Text>
                  <Text style={styles.cartOption}>Borda: {item.crust}</Text>
                  {item.extras.length > 0 && (
                    <Text style={styles.cartOption}>
                      Extras: {item.extras.join(", ")}
                    </Text>
                  )}
                  <Text style={styles.cartPrice}>
                    {money(item.unitPrice * item.quantity)}
                  </Text>
                  <View style={styles.quantityRow}>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => changeCartQuantity(item.cartId, -1)}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </Pressable>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => changeCartQuantity(item.cartId, 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </Pressable>
                    <Pressable onPress={() => removeFromCart(item.cartId)}>
                      <Text style={styles.removeText}>Remover</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total parcial</Text>
              <Text style={styles.totalPrice}>{money(cartTotal)}</Text>
              <Text style={styles.cartNotice}>
                Entrega e pagamento serão configurados em uma próxima etapa.
              </Text>
              <Pressable
                style={styles.primaryButton}
                onPress={() =>
                  Alert.alert(
                    "Próxima etapa",
                    "A sacola está funcionando! Vamos configurar a finalização do pedido depois."
                  )
                }
              >
                <Text style={styles.primaryButtonText}>
                  Continuar pedido
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </>
    );
  }

  function renderGames() {
    return (
      <>
        <SectionTitle title="Diversão na casa" subtitle="Em breve, mais novidades!" />
        <View style={styles.featureCard}>
          <Text style={styles.featureEmoji}>🎁</Text>
          <Text style={styles.featureTitle}>Roleta de cupons</Text>
          <Text style={styles.muted}>
            Uma área para brincar e descobrir ofertas especiais.
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              Alert.alert("Em breve!", "A roleta de cupons será desenvolvida em outra etapa.")
            }
          >
            <Text style={styles.primaryButtonText}>Ver novidades</Text>
          </Pressable>
        </View>
      </>
    );
  }

  function renderProfile() {
    return (
      <>
        <SectionTitle title="Meu perfil" subtitle="Sua experiência Veneza" />
        <View style={styles.profileCard}>
          <Text style={styles.profileEmoji}>👤</Text>
          <Text style={styles.featureTitle}>Olá, cliente!</Text>
          <Text style={styles.muted}>
            Aqui ficarão seus dados, endereços e histórico de pedidos.
          </Text>
        </View>
        {["Meus endereços", "Meus pedidos", "Notificações", "Ajuda e perguntas frequentes"].map(
          (item) => (
            <Pressable
              key={item}
              style={styles.profileRow}
              onPress={() =>
                Alert.alert("Em desenvolvimento", `${item} será adicionado em uma próxima etapa.`)
              }
            >
              <Text style={styles.profileRowText}>{item}</Text>
              <Text style={styles.profileArrow}>›</Text>
            </Pressable>
          )
        )}
      </>
    );
  }

  function SectionTitle({ title, subtitle }) {
    return (
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionHeading}>{title}</Text>
        {!!subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
    );
  }

  function renderCurrentTab() {
    switch (activeTab) {
      case "Cardápio":
        return renderMenu();
      case "Sacola":
        return renderCart();
      case "Jogos":
        return renderGames();
      case "Perfil":
        return renderProfile();
      default:
        return renderHome();
    }
  }

  return (
    <View style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkRed} />

      <View style={styles.topBar}>
        <Pressable onPress={() => setActiveTab("Início")}>
          <Text style={styles.logo}>🍕 Veneza</Text>
          <Text style={styles.logoSubtitle}>SANTA MASSA</Text>
        </Pressable>

        <Pressable
          style={styles.topCart}
          onPress={() => setActiveTab("Sacola")}
        >
          <Text style={styles.topCartText}>🛍️ {cartCount}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { maxWidth: wide ? 1000 : 700 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentTab()}
        <Text style={styles.footer}>Veneza Santa Massa • Feita com carinho ❤️</Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { name: "Início", emoji: "🏠" },
          { name: "Cardápio", emoji: "🍕" },
          { name: "Sacola", emoji: "🛍️" },
          { name: "Jogos", emoji: "🎁" },
          { name: "Perfil", emoji: "👤" },
        ].map((item) => (
          <Pressable
            key={item.name}
            style={styles.navItem}
            onPress={() => setActiveTab(item.name)}
          >
            <Text style={styles.navEmoji}>{item.emoji}</Text>
            <Text
              style={[
                styles.navLabel,
                activeTab === item.name && styles.navLabelActive,
              ]}
            >
              {item.name}
            </Text>
            {activeTab === item.name && <View style={styles.navIndicator} />}
          </Pressable>
        ))}
      </View>

      <Modal
        visible={!!selectedProduct}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>Monte sua pizza 🍕</Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setSelectedProduct(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {selectedProduct && (
            <>
              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalContent}
                showsVerticalScrollIndicator={false}
              >
                <Image
                  source={{ uri: selectedProduct.image }}
                  style={styles.modalImage}
                />

                <Text style={styles.modalProductName}>
                  {selectedProduct.name}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedProduct.description}
                </Text>

                <View style={styles.optionSection}>
                  <Text style={styles.optionHeading}>1. Escolha o tamanho</Text>
                  {SIZES.map((size) => {
                    const chosen = selectedSize === size.name;
                    const price = selectedProduct.price * size.multiplier;

                    return (
                      <Pressable
                        key={size.name}
                        style={[
                          styles.optionRow,
                          chosen && styles.optionRowSelected,
                        ]}
                        onPress={() => setSelectedSize(size.name)}
                      >
                        <View style={styles.optionRadio}>
                          {chosen && <View style={styles.optionRadioInner} />}
                        </View>
                        <View style={styles.optionTextGroup}>
                          <Text style={styles.optionName}>{size.name}</Text>
                          <Text style={styles.optionDetail}>{size.detail}</Text>
                        </View>
                        <Text style={styles.optionPrice}>{money(price)}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.optionSection}>
                  <Text style={styles.optionHeading}>2. Escolha a borda</Text>
                  {CRUSTS.map((crust) => {
                    const chosen = selectedCrust === crust.name;

                    return (
                      <Pressable
                        key={crust.name}
                        style={[
                          styles.optionRow,
                          chosen && styles.optionRowSelected,
                        ]}
                        onPress={() => setSelectedCrust(crust.name)}
                      >
                        <View style={styles.optionRadio}>
                          {chosen && <View style={styles.optionRadioInner} />}
                        </View>
                        <Text style={styles.optionName}>{crust.name}</Text>
                        <Text style={styles.optionPrice}>
                          {crust.price === 0 ? "Grátis" : `+ ${money(crust.price)}`}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.optionSection}>
                  <Text style={styles.optionHeading}>3. Adicione extras</Text>
                  <Text style={styles.optionHint}>
                    Você pode escolher mais de um.
                  </Text>

                  {EXTRAS.map((extra) => {
                    const chosen = selectedExtras.includes(extra.name);

                    return (
                      <Pressable
                        key={extra.name}
                        style={[
                          styles.optionRow,
                          chosen && styles.optionRowSelected,
                        ]}
                        onPress={() => toggleExtra(extra.name)}
                      >
                        <View
                          style={[
                            styles.extraCheckbox,
                            chosen && styles.extraCheckboxSelected,
                          ]}
                        >
                          {chosen && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.optionName}>{extra.name}</Text>
                        <Text style={styles.optionPrice}>
                          + {money(extra.price)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.optionSection}>
                  <Text style={styles.optionHeading}>4. Quantas pizzas?</Text>
                  <View style={styles.quantityPicker}>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => setQuantity((value) => Math.max(1, value - 1))}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </Pressable>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => setQuantity((value) => value + 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={{ height: 24 }} />
              </ScrollView>

              <View style={styles.modalBottom}>
                <View>
                  <Text style={styles.modalTotalLabel}>Total</Text>
                  <Text style={styles.modalTotalPrice}>
                    {money(customizationPrice * quantity)}
                  </Text>
                </View>
                <Pressable style={styles.modalAddButton} onPress={addToCart}>
                  <Text style={styles.modalAddButtonText}>
                    Adicionar à sacola
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  topBar: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: "900",
  },
  logoSubtitle: {
    color: "#FFE5D2",
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "800",
    marginTop: 1,
  },
  topCart: {
    backgroundColor: COLORS.darkRed,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  topCartText: {
    color: COLORS.white,
    fontWeight: "800",
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: "100%",
    alignSelf: "center",
    padding: 16,
    paddingBottom: 30,
  },
  hero: {
    backgroundColor: COLORS.darkRed,
    borderRadius: 22,
    padding: 23,
    minHeight: 220,
    justifyContent: "center",
    marginBottom: 28,
    overflow: "hidden",
  },
  heroText: {
    maxWidth: 450,
  },
  heroEyebrow: {
    color: "#FFD4A7",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 10,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
  },
  heroDescription: {
    color: "#FFE8DD",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 18,
  },
  heroButton: {
    backgroundColor: COLORS.orange,
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  heroButtonText: {
    color: COLORS.dark,
    fontWeight: "900",
  },
  sectionTitle: {
    marginBottom: 15,
    marginTop: 5,
  },
  sectionHeading: {
    color: COLORS.dark,
    fontSize: 23,
    fontWeight: "900",
  },
  sectionSubtitle: {
    color: COLORS.gray,
    fontSize: 13,
    marginTop: 4,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 25,
  },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 3,
    borderWidth: 1,
    borderColor: "#F1E8E0",
  },
  productImage: {
    width: "100%",
    height: 140,
    backgroundColor: COLORS.lightGray,
  },
  popularTag: {
    position: "absolute",
    top: 9,
    left: 8,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  popularTagText: {
    color: COLORS.dark,
    fontSize: 10,
    fontWeight: "800",
  },
  productInfo: {
    paddingHorizontal: 11,
    paddingTop: 10,
    paddingBottom: 7,
  },
  productName: {
    color: COLORS.dark,
    fontSize: 15,
    fontWeight: "900",
  },
  productDescription: {
    color: COLORS.gray,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
    minHeight: 34,
  },
  productPrice: {
    color: COLORS.red,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 8,
  },
  customizeHint: {
    color: COLORS.gray,
    fontSize: 10,
    marginTop: 3,
  },
  addButton: {
    backgroundColor: COLORS.red,
    borderRadius: 10,
    padding: 10,
    margin: 9,
    marginTop: 0,
    alignItems: "center",
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "900",
  },
  categoryGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 25,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1E8E0",
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  categoryFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  filterButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#E9DDD3",
    borderRadius: 20,
    paddingHorizontal: 17,
    paddingVertical: 10,
  },
  filterButtonActive: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  filterText: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: "700",
  },
  filterTextActive: {
    color: COLORS.white,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#EEE4DB",
    paddingTop: 9,
    paddingBottom: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    gap: 3,
  },
  navEmoji: {
    fontSize: 19,
  },
  navLabel: {
    color: COLORS.gray,
    fontSize: 10,
    fontWeight: "700",
  },
  navLabelActive: {
    color: COLORS.red,
    fontWeight: "900",
  },
  navIndicator: {
    height: 3,
    width: 20,
    borderRadius: 4,
    backgroundColor: COLORS.red,
    marginTop: 2,
  },
  footer: {
    textAlign: "center",
    color: COLORS.gray,
    fontSize: 11,
    paddingVertical: 18,
  },
  muted: {
    color: COLORS.gray,
    fontSize: 13,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 28,
    borderRadius: 18,
    marginTop: 10,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    color: COLORS.dark,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.red,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 18,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 13,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1E8E0",
  },
  cartImage: {
    width: 92,
    height: 105,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
  },
  cartDetails: {
    flex: 1,
    marginLeft: 12,
  },
  cartName: {
    color: COLORS.dark,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 5,
  },
  cartOption: {
    color: COLORS.gray,
    fontSize: 11,
    lineHeight: 17,
  },
  cartPrice: {
    color: COLORS.red,
    fontWeight: "900",
    fontSize: 15,
    marginTop: 6,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    flexWrap: "wrap",
  },
  quantityButton: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: "#F8EAE4",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: COLORS.red,
    fontSize: 20,
    fontWeight: "900",
  },
  quantityText: {
    color: COLORS.dark,
    fontSize: 15,
    fontWeight: "900",
    minWidth: 15,
    textAlign: "center",
  },
  removeText: {
    color: COLORS.red,
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 4,
  },
  totalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    marginTop: 5,
    marginBottom: 20,
  },
  totalLabel: {
    color: COLORS.gray,
    fontSize: 13,
  },
  totalPrice: {
    color: COLORS.red,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
  },
  cartNotice: {
    color: COLORS.gray,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  featureCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 25,
    marginTop: 8,
  },
  featureEmoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  featureTitle: {
    color: COLORS.dark,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 25,
    marginBottom: 15,
  },
  profileEmoji: {
    fontSize: 45,
    marginBottom: 12,
  },
  profileRow: {
    backgroundColor: COLORS.white,
    padding: 17,
    borderRadius: 12,
    marginBottom: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileRowText: {
    color: COLORS.dark,
    fontWeight: "700",
    fontSize: 14,
  },
  profileArrow: {
    color: COLORS.red,
    fontSize: 24,
  },
  modalRoot: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  modalHeader: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalHeaderTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: "900",
  },
  closeButton: {
    width: 34,
    height: 34,
    backgroundColor: COLORS.darkRed,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900",
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
    padding: 16,
    paddingBottom: 20,
  },
  modalImage: {
    width: "100%",
    height: 210,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
  },
  modalProductName: {
    color: COLORS.dark,
    fontSize: 25,
    fontWeight: "900",
    marginTop: 16,
  },
  modalDescription: {
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  optionSection: {
    marginTop: 24,
  },
  optionHeading: {
    color: COLORS.dark,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 11,
  },
  optionHint: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#EDE2D9",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 13,
    marginBottom: 8,
    gap: 10,
  },
  optionRowSelected: {
    borderColor: COLORS.red,
    backgroundColor: "#FFF0E9",
  },
  optionRadio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.red,
    alignItems: "center",
    justifyContent: "center",
  },
  optionRadioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.red,
  },
  optionTextGroup: {
    flex: 1,
  },
  optionName: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: "800",
    flex: 1,
  },
  optionDetail: {
    color: COLORS.gray,
    fontSize: 11,
    marginTop: 3,
  },
  optionPrice: {
    color: COLORS.dark,
    fontSize: 12,
    fontWeight: "800",
  },
  extraCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#B8A9A0",
    alignItems: "center",
    justifyContent: "center",
  },
  extraCheckboxSelected: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "900",
  },
  quantityPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    alignSelf: "flex-start",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 8,
  },
  modalBottom: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#EEE4DB",
    padding: 16,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  modalTotalLabel: {
    color: COLORS.gray,
    fontSize: 12,
  },
  modalTotalPrice: {
    color: COLORS.red,
    fontSize: 23,
    fontWeight: "900",
    marginTop: 3,
  },
  modalAddButton: {
    flex: 1,
    maxWidth: 260,
    backgroundColor: COLORS.red,
    borderRadius: 13,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  modalAddButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "900",
  },
});
