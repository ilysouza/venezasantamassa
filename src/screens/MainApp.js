import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AddressScreen from "./AddressScreen";

const PRODUCTS = [
  {
    id: 1,
    name: "Margherita",
    description: "Molho de tomate, muçarela, tomate e manjericão.",
    price: 39.9,
    category: "Tradicionais",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Calabresa",
    description: "Molho de tomate, muçarela, calabresa e cebola.",
    price: 42.9,
    category: "Tradicionais",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Frango com Catupiry",
    description: "Frango desfiado, muçarela e Catupiry.",
    price: 46.9,
    category: "Especiais",
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c8a3f2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Quatro Queijos",
    description: "Muçarela, provolone, parmesão e gorgonzola.",
    price: 49.9,
    category: "Especiais",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Pepperoni",
    description: "Molho de tomate, muçarela e muito pepperoni.",
    price: 47.9,
    category: "Especiais",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Chocolate",
    description: "Chocolate cremoso e confeitos.",
    price: 36.9,
    category: "Doces",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80",
  },
];

const CATEGORIES = ["Todos", "Tradicionais", "Especiais", "Doces"];

export default function MainApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const [cart, setCart] = useState([]);

  const [selectedPizza, setSelectedPizza] = useState(null);
  const [selectedSize, setSelectedSize] = useState("Média");
  const [selectedCrust, setSelectedCrust] = useState("Tradicional");
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [pizzaQuantity, setPizzaQuantity] = useState(1);

  const [showAddressScreen, setShowAddressScreen] = useState(false);

  const [points, setPoints] = useState(120);
  const [coupon, setCoupon] = useState(null);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Todos") {
      return PRODUCTS;
    }

    return PRODUCTS.filter(
      (product) => product.category === selectedCategory
    );
  }, [selectedCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const cartQuantity = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  function openPizza(product) {
    setSelectedPizza(product);
    setSelectedSize("Média");
    setSelectedCrust("Tradicional");
    setSelectedExtras([]);
    setPizzaQuantity(1);
  }

  function toggleExtra(extra) {
    setSelectedExtras((current) => {
      if (current.includes(extra)) {
        return current.filter((item) => item !== extra);
      }

      return [...current, extra];
    });
  }

  function addToCart() {
    if (!selectedPizza) return;

    let extraPrice = 0;

    if (selectedExtras.includes("Bacon")) {
      extraPrice += 5;
    }

    if (selectedExtras.includes("Cheddar")) {
      extraPrice += 4;
    }

    if (selectedExtras.includes("Azeitona")) {
      extraPrice += 2;
    }

    let sizePrice = 0;

    if (selectedSize === "Grande") {
      sizePrice = 8;
    }

    if (selectedSize === "Família") {
      sizePrice = 15;
    }

    const finalPrice = selectedPizza.price + sizePrice + extraPrice;

    const newItem = {
      id: `${selectedPizza.id}-${Date.now()}`,
      productId: selectedPizza.id,
      name: selectedPizza.name,
      size: selectedSize,
      crust: selectedCrust,
      extras: selectedExtras,
      quantity: pizzaQuantity,
      price: finalPrice,
    };

    setCart((current) => [...current, newItem]);

    setSelectedPizza(null);

    Alert.alert(
      "Adicionado! 🍕",
      `${selectedPizza.name} foi adicionada à sua sacola.`
    );
  }

  function increaseCartItem(id) {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseCartItem(id) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function generateCoupon() {
    const coupons = [
      "PIZZA10",
      "MASSA15",
      "VENEZA20",
      "QUEIJO10",
      "SABOR15",
    ];

    const randomCoupon =
      coupons[Math.floor(Math.random() * coupons.length)];

    setCoupon(randomCoupon);
    setPoints((current) => Math.max(0, current - 50));

    Alert.alert(
      "Cupom conquistado! 🎉",
      `Seu cupom é: ${randomCoupon}`
    );
  }

  function checkout() {
    if (cart.length === 0) {
      Alert.alert("Sacola vazia", "Adicione uma pizza antes de continuar.");
      return;
    }

    Alert.alert(
      "Pedido",
      `Seu pedido de R$ ${cartTotal.toFixed(
        2
      )} está pronto para o checkout.`
    );
  }

  function renderHome() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroSmall}>🍕 VENEZA</Text>

          <Text style={styles.heroTitle}>
            Santa Massa
          </Text>

          <Text style={styles.heroText}>
            A pizza que deixa seu dia muito mais gostoso.
          </Text>

          <Pressable
            style={styles.heroButton}
            onPress={() => setActiveTab("menu")}
          >
            <Text style={styles.heroButtonText}>
              Pedir agora
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>
          Categorias
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {CATEGORIES.map((category) => (
            <Pressable
              key={category}
              onPress={() => {
                setSelectedCategory(category);
                setActiveTab("menu");
              }}
              style={[
                styles.categoryButton,
                selectedCategory === category &&
                  styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category &&
                    styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>
          Mais pedidas 🔥
        </Text>

        {PRODUCTS.slice(0, 3).map((product) => (
          <PizzaCard
            key={product.id}
            product={product}
            onPress={() => openPizza(product)}
          />
        ))}

        <View style={styles.promoCard}>
          <Text style={styles.promoEmoji}>🎁</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.promoTitle}>
              Quer ganhar descontos?
            </Text>

            <Text style={styles.promoText}>
              Jogue nossos jogos e acumule pontos.
            </Text>
          </View>

          <Pressable
            style={styles.smallButton}
            onPress={() => setActiveTab("games")}
          >
            <Text style={styles.smallButtonText}>
              Jogar
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  function renderMenu() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>
          Nosso Cardápio 🍕
        </Text>

        <Text style={styles.pageSubtitle}>
          Escolha sua pizza favorita.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 18 }}
        >
          {CATEGORIES.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category &&
                  styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category &&
                    styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {filteredProducts.map((product) => (
          <PizzaCard
            key={product.id}
            product={product}
            onPress={() => openPizza(product)}
          />
        ))}
      </ScrollView>
    );
  }

  function renderCart() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>
          Minha Sacola 🛍️
        </Text>

        {cart.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🍕</Text>

            <Text style={styles.emptyTitle}>
              Sua sacola está vazia
            </Text>

            <Text style={styles.emptyText}>
              Que tal escolher uma pizza deliciosa?
            </Text>

            <Pressable
              style={styles.primaryButton}
              onPress={() => setActiveTab("menu")}
            >
              <Text style={styles.primaryButtonText}>
                Ver cardápio
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {cart.map((item) => (
              <View
                key={item.id}
                style={styles.cartItem}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.cartItemName}>
                    {item.name}
                  </Text>

                  <Text style={styles.cartItemDetails}>
                    {item.size} • {item.crust}
                  </Text>

                  {item.extras.length > 0 && (
                    <Text style={styles.cartItemDetails}>
                      Extras: {item.extras.join(", ")}
                    </Text>
                  )}

                  <Text style={styles.cartPrice}>
                    R$ {item.price.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.quantityBox}>
                  <Pressable
                    onPress={() =>
                      decreaseCartItem(item.id)
                    }
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>
                      −
                    </Text>
                  </Pressable>

                  <Text style={styles.quantityText}>
                    {item.quantity}
                  </Text>

                  <Pressable
                    onPress={() =>
                      increaseCartItem(item.id)
                    }
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>
                      +
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}

            <View style={styles.totalCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Subtotal
                </Text>

                <Text style={styles.totalValue}>
                  R$ {cartTotal.toFixed(2)}
                </Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Entrega
                </Text>

                <Text style={styles.totalValue}>
                  R$ 5,00
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalFinalLabel}>
                  Total
                </Text>

                <Text style={styles.totalFinalValue}>
                  R$ {(cartTotal + 5).toFixed(2)}
                </Text>
              </View>

              <Pressable
                style={styles.checkoutButton}
                onPress={checkout}
              >
                <Text style={styles.checkoutButtonText}>
                  Continuar para pagamento
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    );
  }

  function renderGames() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.pageTitle}>
          Jogos 🎮
        </Text>

        <Text style={styles.pageSubtitle}>
          Divirta-se e ganhe pontos para trocar por descontos.
        </Text>

        <View style={styles.pointsCard}>
          <Text style={styles.pointsLabel}>
            Seus pontos
          </Text>

          <Text style={styles.pointsValue}>
            ⭐ {points}
          </Text>
        </View>

        <View style={styles.gameCard}>
          <Text style={styles.gameEmoji}>
            🎡
          </Text>

          <Text style={styles.gameTitle}>
            Roleta da Sorte
          </Text>

          <Text style={styles.gameText}>
            Gaste 50 pontos e tente ganhar um cupom.
          </Text>

          <Pressable
            style={[
              styles.primaryButton,
              points < 50 && styles.disabledButton,
            ]}
            disabled={points < 50}
            onPress={generateCoupon}
          >
            <Text style={styles.primaryButtonText}>
              Girar roleta
            </Text>
          </Pressable>
        </View>

        {coupon && (
          <View style={styles.couponCard}>
            <Text style={styles.couponTitle}>
              🎉 Seu cupom
            </Text>

            <Text style={styles.couponCode}>
              {coupon}
            </Text>

            <Text style={styles.couponText}>
              Use esse código no seu próximo pedido.
            </Text>
          </View>
        )}

        <View style={styles.gameCard}>
          <Text style={styles.gameEmoji}>
            🏆
          </Text>

          <Text style={styles.gameTitle}>
            Desafio do dia
          </Text>

          <Text style={styles.gameText}>
            Faça um pedido hoje e ganhe 30 pontos extras.
          </Text>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => {
              setPoints((current) => current + 30);
              Alert.alert(
                "Desafio concluído!",
                "+30 pontos adicionados."
              );
            }}
          >
            <Text style={styles.secondaryButtonText}>
              Concluir desafio
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  function renderProfile() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              V
            </Text>
          </View>

          <View>
            <Text style={styles.profileName}>
              Olá, cliente! 👋
            </Text>

            <Text style={styles.profileEmail}>
              Bem-vindo à Veneza Santa Massa
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Minha conta
        </Text>

        <ProfileOption
          icon="📍"
          title="Meus endereços"
          subtitle="Cadastre e gerencie seus endereços"
          onPress={() => setShowAddressScreen(true)}
        />

        <ProfileOption
          icon="📦"
          title="Meus pedidos"
          subtitle="Veja seus pedidos anteriores"
          onPress={() =>
            Alert.alert(
              "Meus pedidos",
              "Aqui aparecerão seus pedidos."
            )
          }
        />

        <ProfileOption
          icon="❤️"
          title="Favoritos"
          subtitle="Suas pizzas favoritas"
          onPress={() =>
            Alert.alert(
              "Favoritos",
              "Aqui aparecerão suas pizzas favoritas."
            )
          }
        />

        <ProfileOption
          icon="🔔"
          title="Notificações"
          subtitle="Gerencie suas notificações"
          onPress={() =>
            Alert.alert(
              "Notificações",
              "Configurações de notificações."
            )
          }
        />

        <Text style={styles.sectionTitle}>
          Ajuda
        </Text>

        <ProfileOption
          icon="❓"
          title="Perguntas frequentes"
          subtitle="Tire suas dúvidas"
          onPress={() =>
            Alert.alert(
              "FAQ",
              "Em breve teremos as perguntas frequentes."
            )
          }
        />

        <ProfileOption
          icon="💬"
          title="Falar com a pizzaria"
          subtitle="Entre em contato conosco"
          onPress={() =>
            Alert.alert(
              "Chat",
              "O chat será conectado posteriormente."
            )
          }
        />

        <ProfileOption
          icon="⚙️"
          title="Configurações"
          subtitle="Preferências do aplicativo"
          onPress={() =>
            Alert.alert(
              "Configurações",
              "Configurações do aplicativo."
            )
          }
        />

        <Pressable
          style={styles.logoutButton}
          onPress={() =>
            Alert.alert(
              "Sair",
              "A função de logout será conectada ao sistema de login posteriormente."
            )
          }
        >
          <Text style={styles.logoutText}>
            Sair da conta
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

  function renderContent() {
    if (activeTab === "home") {
      return renderHome();
    }

    if (activeTab === "menu") {
      return renderMenu();
    }

    if (activeTab === "cart") {
      return renderCart();
    }

    if (activeTab === "games") {
      return renderGames();
    }

    if (activeTab === "profile") {
      return renderProfile();
    }

    return renderHome();
  }

  if (showAddressScreen) {
    return (
      <AddressScreen
        onBack={() => setShowAddressScreen(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderContent()}

      <View style={styles.bottomNav}>
        <NavButton
          icon="🏠"
          label="Início"
          active={activeTab === "home"}
          onPress={() => setActiveTab("home")}
        />

        <NavButton
          icon="🍕"
          label="Cardápio"
          active={activeTab === "menu"}
          onPress={() => setActiveTab("menu")}
        />

        <NavButton
          icon="🛍️"
          label="Sacola"
          active={activeTab === "cart"}
          badge={cartQuantity}
          onPress={() => setActiveTab("cart")}
        />

        <NavButton
          icon="🎮"
          label="Jogos"
          active={activeTab === "games"}
          onPress={() => setActiveTab("games")}
        />

        <NavButton
          icon="👤"
          label="Perfil"
          active={activeTab === "profile"}
          onPress={() => setActiveTab("profile")}
        />
      </View>

      <Modal
        visible={selectedPizza !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedPizza(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Personalize sua pizza 🍕
                </Text>

                <Pressable
                  onPress={() => setSelectedPizza(null)}
                >
                  <Text style={styles.closeText}>
                    ✕
                  </Text>
                </Pressable>
              </View>

              {selectedPizza && (
                <>
                  <Text style={styles.modalPizzaName}>
                    {selectedPizza.name}
                  </Text>

                  <Text style={styles.modalDescription}>
                    {selectedPizza.description}
                  </Text>

                  <Text style={styles.optionTitle}>
                    Tamanho
                  </Text>

                  {["Pequena", "Média", "Grande", "Família"].map(
                    (size) => (
                      <OptionButton
                        key={size}
                        label={size}
                        selected={selectedSize === size}
                        onPress={() =>
                          setSelectedSize(size)
                        }
                      />
                    )
                  )}

                  <Text style={styles.optionTitle}>
                    Borda
                  </Text>

                  {[
                    "Tradicional",
                    "Recheada com Catupiry",
                    "Recheada com Cheddar",
                  ].map((crust) => (
                    <OptionButton
                      key={crust}
                      label={crust}
                      selected={selectedCrust === crust}
                      onPress={() =>
                        setSelectedCrust(crust)
                      }
                    />
                  ))}

                  <Text style={styles.optionTitle}>
                    Extras
                  </Text>

                  {[
                    { name: "Bacon", price: 5 },
                    { name: "Cheddar", price: 4 },
                    { name: "Azeitona", price: 2 },
                  ].map((extra) => (
                    <OptionButton
                      key={extra.name}
                      label={`${extra.name} (+R$ ${extra.price.toFixed(
                        2
                      )})`}
                      selected={selectedExtras.includes(
                        extra.name
                      )}
                      onPress={() =>
                        toggleExtra(extra.name)
                      }
                    />
                  ))}

                  <Text style={styles.optionTitle}>
                    Quantidade
                  </Text>

                  <View style={styles.modalQuantity}>
                    <Pressable
                      style={styles.quantityButtonLarge}
                      onPress={() =>
                        setPizzaQuantity(
                          Math.max(1, pizzaQuantity - 1)
                        )
                      }
                    >
                      <Text style={styles.quantityButtonText}>
                        −
                      </Text>
                    </Pressable>

                    <Text style={styles.modalQuantityText}>
                      {pizzaQuantity}
                    </Text>

                    <Pressable
                      style={styles.quantityButtonLarge}
                      onPress={() =>
                        setPizzaQuantity(
                          pizzaQuantity + 1
                        )
                      }
                    >
                      <Text style={styles.quantityButtonText}>
                        +
                      </Text>
                    </Pressable>
                  </View>

                  <Pressable
                    style={styles.addButton}
                    onPress={addToCart}
                  >
                    <Text style={styles.addButtonText}>
                      Adicionar à sacola
                    </Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function PizzaCard({ product, onPress }) {
  return (
    <Pressable
      style={styles.pizzaCard}
      onPress={onPress}
    >
      <View style={styles.pizzaImagePlaceholder}>
        <Text style={styles.pizzaEmoji}>
          🍕
        </Text>
      </View>

      <View style={styles.pizzaInfo}>
        <Text style={styles.pizzaName}>
          {product.name}
        </Text>

        <Text style={styles.pizzaDescription}>
          {product.description}
        </Text>

        <View style={styles.pizzaBottom}>
          <Text style={styles.pizzaPrice}>
            R$ {product.price.toFixed(2)}
          </Text>

          <View style={styles.plusButton}>
            <Text style={styles.plusText}>
              +
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function ProfileOption({
  icon,
  title,
  subtitle,
  onPress,
}) {
  return (
    <Pressable
      style={styles.profileOption}
      onPress={onPress}
    >
      <View style={styles.profileIcon}>
        <Text style={styles.profileIconText}>
          {icon}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.profileOptionTitle}>
          {title}
        </Text>

        <Text style={styles.profileOptionSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Text style={styles.arrow}>
        ›
      </Text>
    </Pressable>
  );
}

function NavButton({
  icon,
  label,
  active,
  badge,
  onPress,
}) {
  return (
    <Pressable
      style={styles.navButton}
      onPress={onPress}
    >
      <View>
        <Text
          style={[
            styles.navIcon,
            active && styles.navIconActive,
          ]}
        >
          {icon}
        </Text>

        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badge}
            </Text>
          </View>
        )}
      </View>

      <Text
        style={[
          styles.navLabel,
          active && styles.navLabelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function OptionButton({
  label,
  selected,
  onPress,
}) {
  return (
    <Pressable
      style={[
        styles.optionButton,
        selected && styles.optionButtonSelected,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.optionButtonText,
          selected && styles.optionButtonTextSelected,
        ]}
      >
        {selected ? "✓ " : ""}
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF8F3",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFF8F3",
  },

  content: {
    padding: 20,
    paddingBottom: 110,
  },

  hero: {
    backgroundColor: "#D92B20",
    borderRadius: 24,
    padding: 24,
    marginBottom: 25,
  },

  heroSmall: {
    color: "#FFD9A0",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
    marginTop: 5,
  },

  heroText: {
    color: "#FFF4EE",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
    maxWidth: 300,
  },

  heroButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginTop: 20,
  },

  heroButtonText: {
    color: "#D92B20",
    fontSize: 15,
    fontWeight: "800",
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#291A16",
    marginBottom: 14,
    marginTop: 8,
  },

  categoryScroll: {
    marginBottom: 22,
  },

  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8D8D1",
    marginRight: 10,
  },

  categoryButtonActive: {
    backgroundColor: "#D92B20",
    borderColor: "#D92B20",
  },

  categoryText: {
    color: "#5C4740",
    fontWeight: "700",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  pizzaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#F0E2DC",
  },

  pizzaImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: "#FFE1C7",
    alignItems: "center",
    justifyContent: "center",
  },

  pizzaEmoji: {
    fontSize: 48,
  },

  pizzaInfo: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: "space-between",
  },

  pizzaName: {
    color: "#291A16",
    fontSize: 18,
    fontWeight: "900",
  },

  pizzaDescription: {
    color: "#765F57",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
  },

  pizzaBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  pizzaPrice: {
    color: "#D92B20",
    fontSize: 17,
    fontWeight: "900",
  },

  plusButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#D92B20",
    alignItems: "center",
    justifyContent: "center",
  },

  plusText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 27,
  },

  promoCard: {
    backgroundColor: "#FFF0D8",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  promoEmoji: {
    fontSize: 34,
    marginRight: 12,
  },

  promoTitle: {
    color: "#291A16",
    fontSize: 16,
    fontWeight: "900",
  },

  promoText: {
    color: "#765F57",
    fontSize: 13,
    marginTop: 3,
  },

  smallButton: {
    backgroundColor: "#D92B20",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 8,
  },

  smallButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  pageTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#291A16",
    marginTop: 5,
  },

  pageSubtitle: {
    color: "#765F57",
    fontSize: 15,
    marginTop: 5,
    marginBottom: 22,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 30,
    alignItems: "center",
    marginTop: 30,
  },

  emptyEmoji: {
    fontSize: 60,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#291A16",
    marginTop: 12,
  },

  emptyText: {
    color: "#765F57",
    marginTop: 6,
    textAlign: "center",
  },

  primaryButton: {
    backgroundColor: "#D92B20",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 18,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },

  disabledButton: {
    opacity: 0.4,
  },

  cartItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0E2DC",
  },

  cartItemName: {
    color: "#291A16",
    fontSize: 17,
    fontWeight: "900",
  },

  cartItemDetails: {
    color: "#765F57",
    fontSize: 12,
    marginTop: 3,
  },

  cartPrice: {
    color: "#D92B20",
    fontWeight: "900",
    marginTop: 7,
  },

  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },

  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F8E4DE",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityButtonText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#D92B20",
  },

  quantityText: {
    fontSize: 16,
    fontWeight: "900",
    marginHorizontal: 10,
    color: "#291A16",
  },

  totalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 5,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  totalLabel: {
    color: "#765F57",
    fontSize: 15,
  },

  totalValue: {
    color: "#291A16",
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#EDE0DA",
    marginVertical: 8,
  },

  totalFinalLabel: {
    color: "#291A16",
    fontSize: 18,
    fontWeight: "900",
  },

  totalFinalValue: {
    color: "#D92B20",
    fontSize: 20,
    fontWeight: "900",
  },

  checkoutButton: {
    backgroundColor: "#D92B20",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 15,
  },

  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  pointsCard: {
    backgroundColor: "#D92B20",
    borderRadius: 22,
    padding: 22,
    marginBottom: 15,
  },

  pointsLabel: {
    color: "#FFE8E0",
    fontSize: 14,
    fontWeight: "700",
  },

  pointsValue: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 4,
  },

  gameCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F0E2DC",
  },

  gameEmoji: {
    fontSize: 42,
  },

  gameTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#291A16",
    marginTop: 8,
  },

  gameText: {
    color: "#765F57",
    lineHeight: 20,
    marginTop: 5,
  },

  secondaryButton: {
    backgroundColor: "#FFF0D8",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },

  secondaryButtonText: {
    color: "#B64B17",
    fontWeight: "900",
  },

  couponCard: {
    backgroundColor: "#FFF0D8",
    borderRadius: 22,
    padding: 22,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1D0A5",
  },

  couponTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#291A16",
  },

  couponCode: {
    color: "#D92B20",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 8,
  },

  couponText: {
    color: "#765F57",
    marginTop: 5,
  },

  profileHeader: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D92B20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
  },

  profileName: {
    color: "#291A16",
    fontSize: 18,
    fontWeight: "900",
  },

  profileEmail: {
    color: "#765F57",
    fontSize: 12,
    marginTop: 4,
  },

  profileOption: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#FFF0D8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  profileIconText: {
    fontSize: 22,
  },

  profileOptionTitle: {
    color: "#291A16",
    fontWeight: "900",
    fontSize: 15,
  },

  profileOptionSubtitle: {
    color: "#765F57",
    fontSize: 12,
    marginTop: 3,
  },

  arrow: {
    color: "#D92B20",
    fontSize: 30,
    fontWeight: "300",
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: "#D92B20",
    borderRadius: 14,
    padding: 15,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 30,
  },

  logoutText: {
    color: "#D92B20",
    fontWeight: "900",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E9DDD8",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 5,
  },

  navButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 55,
  },

  navIcon: {
    fontSize: 22,
    opacity: 0.55,
  },

  navIconActive: {
    opacity: 1,
  },

  navLabel: {
    color: "#8A7770",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },

  navLabelActive: {
    color: "#D92B20",
  },

  badge: {
    position: "absolute",
    right: -8,
    top: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#D92B20",
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#FFF8F3",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
    padding: 22,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#291A16",
  },

  closeText: {
    fontSize: 23,
    color: "#765F57",
  },

  modalPizzaName: {
    fontSize: 25,
    fontWeight: "900",
    color: "#D92B20",
    marginTop: 20,
  },

  modalDescription: {
    color: "#765F57",
    lineHeight: 20,
    marginTop: 5,
  },

  optionTitle: {
    color: "#291A16",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 8,
  },

  optionButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6D9D2",
    borderRadius: 13,
    padding: 14,
    marginBottom: 8,
  },

  optionButtonSelected: {
    backgroundColor: "#FFF0D8",
    borderColor: "#D92B20",
  },

  optionButtonText: {
    color: "#5C4740",
    fontWeight: "700",
  },

  optionButtonTextSelected: {
    color: "#D92B20",
    fontWeight: "900",
  },

  modalQuantity: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  quantityButtonLarge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F8E4DE",
    alignItems: "center",
    justifyContent: "center",
  },

  modalQuantityText: {
    fontSize: 20,
    fontWeight: "900",
    marginHorizontal: 25,
    color: "#291A16",
  },

  addButton: {
    backgroundColor: "#D92B20",
    padding: 17,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 10,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});