<template>
  <div class="rules-modal" @click.self="$emit('close')">
    <div class="rules-container">
      <div class="rules-header">
        <h2>五人掼蛋规则说明</h2>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>
      
      <div class="rules-content">
        <section class="rule-section">
          <h3>基本设置</h3>
          <ul>
            <li><strong>牌数：</strong>使用3副牌，去掉2张大王，保留1张大王</li>
            <li><strong>百搭牌：</strong>百搭牌始终是红桃2</li>
            <li><strong>出牌顺序：</strong>每局游戏由皇帝先出牌</li>
          </ul>
        </section>
        
        <section class="rule-section">
          <h3>身份确定</h3>
          <div class="identity-box">
            <div class="identity">
              <div class="identity-icon">👑</div>
              <div class="identity-desc">
                <strong>皇帝</strong> <span>抽到大王的玩家</span>
              </div>
            </div>
            <div class="identity">
              <div class="identity-icon">🃏</div>
              <div class="identity-desc">
                <strong>叫牌</strong> <span>皇帝从手牌中挑选两张相同的牌，同时展示给所有玩家</span>
              </div>
            </div>
            <div class="identity">
              <div class="identity-icon">🛡️</div>
              <div class="identity-desc">
                <strong>侍卫</strong> <span>持有另一张与叫牌相同牌的玩家（不能在出牌前展示）</span>
              </div>
            </div>
          </div>
          <div class="special-note">
            <strong>特殊情况：</strong>若未被展示的另一张叫牌，也在皇帝手中，则皇帝自己单独组队
          </div>
        </section>
        
        <section class="rule-section">
          <h3>特殊牌力</h3>
          <ul>
            <li>大王价值相当于6.5炸（能压6个A，但不能压7个2）</li>
            <li>三个小王一起出，效力等同于一个大王</li>
            <li>未被展示的叫牌，在游戏过程中单独打出，这张牌可以压过任何除了大小王的单张牌</li>
          </ul>
        </section>
        
        <section class="rule-section">
          <h3>计分规则</h3>
          <h4>皇帝和侍卫是两人时:</h4>
          <table class="score-table">
            <tr>
              <th>排名组合</th>
              <th>皇帝/侍卫得分</th>
              <th>农民得分</th>
            </tr>
            <tr>
              <td>头游+末游</td>
              <td>各+30</td>
              <td>各-20</td>
            </tr>
            <tr>
              <td>头游+三/四游</td>
              <td>各+60</td>
              <td>各-40</td>
            </tr>
            <tr>
              <td>头游+二游</td>
              <td>各+90</td>
              <td>各-60</td>
            </tr>
            <tr>
              <td>非头游+非末游</td>
              <td>各-30</td>
              <td>各+20</td>
            </tr>
            <tr>
              <td>二/三游+末游</td>
              <td>各-60</td>
              <td>各+40</td>
            </tr>
            <tr>
              <td>四游+末游</td>
              <td>各-90</td>
              <td>各+60</td>
            </tr>
          </table>
          
          <h4>皇帝自己一伙时:</h4>
          <table class="score-table">
            <tr>
              <th>排名</th>
              <th>皇帝得分</th>
              <th>农民得分</th>
            </tr>
            <tr>
              <td>头游</td>
              <td>+720</td>
              <td>各-180</td>
            </tr>
            <tr>
              <td>非头游</td>
              <td>-360</td>
              <td>各+90</td>
            </tr>
          </table>
        </section>
      </div>
      
      <div class="rules-footer">
        <button class="close-btn" @click="$emit('close')">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RulesModal',
  emits: ['close']
}
</script>

<style scoped>
.rules-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
}

.rules-container {
  background-color: white;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.rules-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.rules-header h2 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0 10px;
}

.rules-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.rule-section {
  margin-bottom: 24px;
}

.rule-section h3 {
  color: #4a7bff;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.rule-section h4 {
  color: #333;
  margin: 16px 0 10px 0;
}

.rule-section ul, .rule-section ol {
  padding-left: 20px;
  margin-bottom: 10px;
}

.rule-section li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.identity-box {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.identity {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
  min-width: 160px;
  flex: 1;
}

.identity-icon {
  font-size: 24px;
  margin-right: 12px;
}

.identity-desc {
  flex: 1;
}

.identity-desc strong {
  display: inline-block;
  margin-right: 5px;
}

.identity-desc span {
  font-size: 13px;
  color: #555;
}

.special-note {
  background-color: #fff8e1;
  border-left: 4px solid #ffc107;
  padding: 10px 15px;
  margin: 15px 0;
  border-radius: 4px;
}

.score-table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 14px;
}

.score-table th, .score-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.score-table th {
  background-color: #f5f5f5;
}

.score-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.rules-footer {
  padding: 15px;
  border-top: 1px solid #eee;
  text-align: center;
  background: white;
  position: sticky;
  bottom: 0;
}

.close-btn {
  background-color: #4a7bff;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

@media (max-width: 480px) {
  .rules-container {
    max-height: 95vh;
  }
  
  .identity-box {
    flex-direction: column;
  }
  
  .score-table {
    font-size: 12px;
  }
  
  .score-table th, .score-table td {
    padding: 6px 4px;
  }
  
  .rules-content {
    padding: 15px;
  }
}
</style>
