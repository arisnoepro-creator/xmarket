-- Enums
CREATE TYPE "Role" AS ENUM ('USER','MOD','ADMIN');
CREATE TYPE "Condition" AS ENUM ('NEW','LIKE_NEW','VERY_GOOD','GOOD','FAIR');
CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE','RESERVED','SOLD','HIDDEN');
CREATE TYPE "OfferStatus" AS ENUM ('PENDING','ACCEPTED','DECLINED','EXPIRED');
CREATE TYPE "OrderStatus" AS ENUM ('PAYMENT_INTENT','PAID','LABELED','SHIPPED','DELIVERED','RELEASED','REFUNDED','CANCELED');

-- Users
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "image" TEXT,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "stripeAccountId" TEXT,
  "verifiedSeller" BOOLEAN NOT NULL DEFAULT FALSE,
  "shopSlug" TEXT UNIQUE,
  "shopBio" TEXT,
  "shopBanner" TEXT,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Listings
CREATE TABLE "Listing" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'EUR',
  "condition" "Condition" NOT NULL,
  "brand" TEXT,
  "size" TEXT,
  "category" TEXT NOT NULL,
  "sellerId" TEXT NOT NULL,
  "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Listing_seller_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "Listing_category_idx" ON "Listing" ("category");
CREATE INDEX "Listing_brand_idx" ON "Listing" ("brand");
CREATE INDEX "Listing_size_idx" ON "Listing" ("size");
CREATE INDEX "Listing_condition_idx" ON "Listing" ("condition");
CREATE INDEX "Listing_priceCents_idx" ON "Listing" ("priceCents");
CREATE INDEX "Listing_createdAt_idx" ON "Listing" ("createdAt");

-- Photos
CREATE TABLE "Photo" (
  "id" TEXT PRIMARY KEY,
  "url" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "listingId" TEXT NOT NULL,
  CONSTRAINT "Photo_listing_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Offers
CREATE TABLE "Offer" (
  "id" TEXT PRIMARY KEY,
  "listingId" TEXT NOT NULL,
  "buyerId" TEXT NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Offer_listing_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Offer_listing_buyer_idx" ON "Offer" ("listingId","buyerId");

-- Favorites (junction)
CREATE TABLE "Favorite" (
  "userId" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  PRIMARY KEY ("userId","listingId"),
  CONSTRAINT "Favorite_user_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Favorite_listing_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Orders
CREATE TABLE "Order" (
  "id" TEXT PRIMARY KEY,
  "buyerId" TEXT NOT NULL,
  "listingId" TEXT NOT NULL UNIQUE,
  "amountCents" INTEGER NOT NULL,
  "feeCents" INTEGER NOT NULL,
  "shipCents" INTEGER NOT NULL,
  "shipMethod" TEXT NOT NULL DEFAULT 'relais',
  "status" "OrderStatus" NOT NULL DEFAULT 'PAYMENT_INTENT',
  "paymentPI" TEXT,
  "tracking" TEXT,
  "carrier" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Order_buyer_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Order_listing_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Reviews
CREATE TABLE "Review" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL UNIQUE,
  "aboutId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "photoUrl" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Review_about_fkey" FOREIGN KEY ("aboutId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Review_author_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Messages
CREATE TABLE "Message" (
  "id" TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX "Message_conv_created_idx" ON "Message" ("conversationId","createdAt");