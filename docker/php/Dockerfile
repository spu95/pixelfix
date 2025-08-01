FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/backend

# Copy composer files
COPY services/php/composer.json services/php/composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy application code
COPY services/php/. .

# Set proper permissions
RUN chown -R www-data:www-data /var/www/backend
RUN chmod -R 755 /var/www/backend

# Copy supervisor configuration
COPY docker/php/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create startup script
RUN echo '#!/bin/bash\n\
    php bin/console cache:clear --env=prod\n\
    php bin/console doctrine:migrations:migrate --no-interaction\n\
    supervisord -c /etc/supervisor/conf.d/supervisord.conf' > /startup.sh && \
    chmod +x /startup.sh

EXPOSE 9000

CMD ["/startup.sh"]
