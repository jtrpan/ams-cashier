<?php
/**
 * Plugin Name: Antario Pay for WooCommerce
 * Description: Embed Antario Checkout on WooCommerce.
 */

defined('ABSPATH') || exit;

add_action('admin_menu', function(){
  add_submenu_page(
    'woocommerce', 'Antario Pay Settings', 'Antario Pay',
    'manage_woocommerce', 'antario-pay', 'antario_admin_page'
  );
});

function antario_admin_page(){
  ?>
  <h1>Antario Pay Settings</h1>
  <form method="post" action="options.php">
    <?php
    settings_fields('antario_options');
    do_settings_sections('antario-pay');
    submit_button();
    ?>
  </form>
  <?php
}

add_action('admin_init', function(){
  register_setting('antario_options', 'antario_gateway_url');
  register_setting('antario_options', 'antario_return_url');
  add_settings_section('antario_main', 'Main Settings', null, 'antario-pay');
  add_settings_field('gateway_url','Gateway URL','antario_field_cb','antario-pay','antario_main');
  add_settings_field('return_url','Return URL','antario_field_cb2','antario-pay','antario_main');
});

function antario_field_cb(){
  $v = get_option('antario_gateway_url');
  echo "<input name='antario_gateway_url' value='$v' />";
}
function antario_field_cb2(){
  $v = get_option('antario_return_url');
  echo "<input name='antario_return_url' value='$v' />";
}

add_action('woocommerce_thankyou', function($order_id){
  // Optionally show Antario status or links here
});

add_action('wp_enqueue_scripts', function(){
  wp_enqueue_script(
    'antario-sdk',
    get_option('antario_gateway_url') . '/sdk.js',
    [], null, true
  );
  wp_add_inline_script('antario-sdk', "
    AntarioPay.init({
      gatewayUrl: '". esc_js(get_option('antario_gateway_url')) ."',
      amount: " . (int) (WC()->cart->total * 100) . ",
      currency: '" . get_woocommerce_currency() . "',
      returnUrl: '". esc_js(get_option('antario_return_url')) ."',
      mount: '#payment',
      label: 'Pay with Antario'
    });
  ");
});
